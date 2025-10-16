import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

export interface ServerConfig {
    apiKey: string;
    baseUrl: string;
    host: string;
    port: number;
    capabilities: string[];
    extraModels: string[];
}

export class Oai2OllamaServer {
    private server: http.Server | null = null;
    private config: ServerConfig;

    constructor(config: ServerConfig) {
        this.config = config;
    }

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server = http.createServer((req, res) => {
                this.handleRequest(req, res).catch(error => {
                    console.error('Request handling error:', error);
                    if (!res.headersSent) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: error.message }));
                    }
                });
            });

            this.server.on('error', (error) => {
                reject(error);
            });

            this.server.listen(this.config.port, this.config.host, () => {
                resolve();
            });
        });
    }

    public stop(): Promise<void> {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    this.server = null;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const url = req.url || '/';
        const method = req.method || 'GET';

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // Route requests
        if (url === '/api/tags' && method === 'GET') {
            await this.handleApiTags(req, res);
        } else if (url === '/api/show' && method === 'POST') {
            await this.handleApiShow(req, res);
        } else if (url === '/api/version' && method === 'GET') {
            await this.handleApiVersion(req, res);
        } else if (url === '/v1/models' && method === 'GET') {
            await this.handleV1Models(req, res);
        } else if (url === '/v1/chat/completions' && method === 'POST') {
            await this.handleV1ChatCompletions(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
        }
    }

    private async handleApiTags(_req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        try {
            const modelsData = await this.fetchUpstreamModels();
            const modelsMap: Record<string, { name: string; model: string }> = {};

            // Add models from upstream
            if (modelsData && modelsData.data) {
                for (const model of modelsData.data) {
                    modelsMap[model.id] = { name: model.id, model: model.id };
                }
            }

            // Add extra models
            for (const modelName of this.config.extraModels) {
                modelsMap[modelName] = { name: modelName, model: modelName };
            }

            const response = {
                models: Object.values(modelsMap)
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: errorMessage }));
        }
    }

    private async handleApiShow(_req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const response = {
            model_info: {
                'general.architecture': 'CausalLM'
            },
            capabilities: ['completion', ...this.config.capabilities]
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    }

    private async handleApiVersion(_req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const response = {
            version: '0.11.4'
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    }

    private async handleV1Models(_req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        try {
            const modelsData = await this.fetchUpstreamModels();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(modelsData));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: errorMessage }));
        }
    }

    private async handleV1ChatCompletions(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        try {
            const body = await this.readRequestBody(req);
            const requestData = JSON.parse(body);

            if (requestData.stream) {
                await this.proxyStreamingRequest(requestData, res);
            } else {
                await this.proxyNonStreamingRequest(requestData, res);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Chat completions error:', errorMessage);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: errorMessage }));
            }
        }
    }

    private async fetchUpstreamModels(): Promise<any> {
        return this.makeUpstreamRequest('/models', 'GET');
    }

    private async proxyStreamingRequest(requestData: any, res: http.ServerResponse): Promise<void> {
        const upstream = new URL(this.config.baseUrl);
        const isHttps = upstream.protocol === 'https:';
        const httpModule = isHttps ? https : http;

        // Serialize request data and calculate content length
        const requestBody = JSON.stringify(requestData);
        const contentLength = Buffer.byteLength(requestBody, 'utf8');

        // Fix path construction to ensure proper slash handling
        const pathPrefix = upstream.pathname.endsWith('/')
            ? upstream.pathname
            : upstream.pathname + '/';
        const fullPath = pathPrefix + 'chat/completions';

        const options = {
            hostname: upstream.hostname,
            port: upstream.port || (isHttps ? 443 : 80),
            path: fullPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': contentLength,
                'Authorization': `Bearer ${this.config.apiKey}`
            }
        };

        const proxyReq = httpModule.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode || 200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            proxyRes.on('data', (chunk) => {
                // console.log('Received chunk:', chunk.toString('utf8'));
                // console.log('Chunk size:', chunk.length, 'bytes');
                res.write(chunk);
            });

            proxyRes.on('end', () => {
                res.end();
            });
        });

        proxyReq.on('error', (error) => {
            console.error('Proxy request error:', error);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });

        proxyReq.write(requestBody);
        proxyReq.end();
    }

    private async proxyNonStreamingRequest(requestData: any, res: http.ServerResponse): Promise<void> {
        const response = await this.makeUpstreamRequest('/chat/completions', 'POST', requestData);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    }

    private makeUpstreamRequest(path: string, method: string, data?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const upstream = new URL(this.config.baseUrl);
            const isHttps = upstream.protocol === 'https:';
            const httpModule = isHttps ? https : http;

            const fullPath = upstream.pathname.endsWith('/')
                ? upstream.pathname + path.replace(/^\//, '')
                : upstream.pathname + path;

            const options = {
                hostname: upstream.hostname,
                port: upstream.port || (isHttps ? 443 : 80),
                path: fullPath,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                timeout: 60000
            };

            const req = httpModule.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk.toString();
                });

                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            resolve(JSON.parse(responseData));
                        } catch (error) {
                            reject(new Error('Failed to parse response: ' + responseData));
                        }
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    private readRequestBody(req: http.IncomingMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                resolve(body);
            });

            req.on('error', (error) => {
                reject(error);
            });
        });
    }
}
