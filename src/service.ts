import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as net from 'net';
import { Oai2OllamaServer } from './server';

export class Oai2OllamaService implements vscode.Disposable {
    private server: Oai2OllamaServer | null = null;
    private outputChannel: vscode.OutputChannel;
    private statusChangeEmitter = new vscode.EventEmitter<boolean>();
    public readonly onStatusChange = this.statusChangeEmitter.event;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Oai2Ollama');
    }

    public isRunning(): boolean {
        return this.server !== null;
    }

    public async start(): Promise<void> {
        if (this.isRunning()) {
            vscode.window.showWarningMessage('Oai2Ollama service is already running');
            return;
        }

        const config = vscode.workspace.getConfiguration('oai2ollama');
        const port = config.get<number>('port', 11434);

        // Check if port is already occupied
        const isPortOccupied = await this.checkPortOccupied(port);
        if (isPortOccupied) {
            const action = await vscode.window.showErrorMessage(
                `Port ${port} is already in use. Another process may be using it.`,
                'Kill Process',
                'Cancel'
            );

            if (action === 'Kill Process') {
                await this.killProcessOnPort(port);
                // Wait a bit for the port to be released
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Check again if port is still occupied
                const stillOccupied = await this.checkPortOccupied(port);
                if (stillOccupied) {
                    vscode.window.showErrorMessage(`Port ${port} is still occupied. Please free the port manually.`);
                    return;
                }
            } else {
                return;
            }
        }

        try {
            await this.startService();
            vscode.window.showInformationMessage('Oai2Ollama service started successfully');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to start Oai2Ollama service: ${error}`);
        }
    }

    public async stop(): Promise<void> {
        if (!this.isRunning()) {
            vscode.window.showWarningMessage('Oai2Ollama service is not running');
            return;
        }

        try {
            await this.server?.stop();
            this.server = null;
            this.statusChangeEmitter.fire(false);
            this.outputChannel.appendLine('Service stopped');
            vscode.window.showInformationMessage('Oai2Ollama service stopped');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to stop service: ${error}`);
        }
    }

    public async restart(): Promise<void> {
        if (this.isRunning()) {
            await this.stop();
            // Wait a bit before restarting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        await this.start();
    }

    public async showStatus(): Promise<void> {
        const config = vscode.workspace.getConfiguration('oai2ollama');
        const port = config.get<number>('port', 11434);
        const host = config.get<string>('host', 'localhost');
        const baseUrl = config.get<string>('baseUrl', '');
        const apiKey = config.get<string>('apiKey', '');
        const capabilities = config.get<string[]>('capabilities', []);
        const models = config.get<string[]>('models', []);

        const status = this.isRunning() ? '✓ Running' : '✗ Stopped';
        const portStatus = await this.checkPortOccupied(port);

        const statusMessage = `
Oai2Ollama Service Status
========================
Status: ${status}
Port: ${port} ${portStatus ? '(occupied)' : '(available)'}
Host: ${host}
Server URL: http://${host}:${port}
Base URL: ${baseUrl || '(not configured)'}
API Key: ${apiKey ? '***configured***' : '(not configured)'}
Capabilities: ${capabilities.length > 0 ? capabilities.join(', ') : 'none'}
Extra Models: ${models.length > 0 ? models.join(', ') : 'none'}

Available Endpoints:
  - GET  http://${host}:${port}/api/tags          - List models (Ollama format)
  - POST http://${host}:${port}/api/show          - Show model capabilities
  - GET  http://${host}:${port}/api/version       - Get version info
  - GET  http://${host}:${port}/v1/models         - List models (OpenAI format)
  - POST http://${host}:${port}/v1/chat/completions - Chat completions
`.trim();

        this.outputChannel.clear();
        this.outputChannel.appendLine(statusMessage);
        this.outputChannel.show();
    }

    private async startService(): Promise<void> {
        const config = vscode.workspace.getConfiguration('oai2ollama');
        const apiKey = config.get<string>('apiKey', '') || process.env.OPENAI_API_KEY || '';
        const baseUrl = config.get<string>('baseUrl', '') || process.env.OPENAI_BASE_URL || '';
        const host = config.get<string>('host', 'localhost');
        const port = config.get<number>('port', 11434);
        const capabilities = config.get<string[]>('capabilities', []);
        const models = config.get<string[]>('models', []);

        if (!apiKey || !baseUrl) {
            const openSettings = await vscode.window.showErrorMessage(
                'Please configure API key and Base URL in settings',
                'Open Settings'
            );
            if (openSettings) {
                vscode.commands.executeCommand('oai2ollama.openSettings');
            }
            throw new Error('Missing API key or Base URL');
        }

        this.outputChannel.clear();
        this.outputChannel.appendLine(`Starting Oai2Ollama service...`);
        this.outputChannel.appendLine(`Host: ${host}`);
        this.outputChannel.appendLine(`Port: ${port}`);
        this.outputChannel.appendLine(`Base URL: ${baseUrl}`);
        this.outputChannel.appendLine(`Capabilities: ${capabilities.join(', ') || 'none'}`);
        this.outputChannel.appendLine(`Extra Models: ${models.join(', ') || 'none'}`);
        this.outputChannel.appendLine('');

        this.server = new Oai2OllamaServer({
            apiKey,
            baseUrl,
            host,
            port,
            capabilities,
            extraModels: models
        });

        try {
            await this.server.start();
            this.outputChannel.appendLine(`✓ Server started successfully on http://${host}:${port}`);
            this.outputChannel.appendLine('');
            this.outputChannel.appendLine('Available endpoints:');
            this.outputChannel.appendLine(`  - GET  http://${host}:${port}/api/tags`);
            this.outputChannel.appendLine(`  - POST http://${host}:${port}/api/show`);
            this.outputChannel.appendLine(`  - GET  http://${host}:${port}/api/version`);
            this.outputChannel.appendLine(`  - GET  http://${host}:${port}/v1/models`);
            this.outputChannel.appendLine(`  - POST http://${host}:${port}/v1/chat/completions`);
            this.statusChangeEmitter.fire(true);
            this.outputChannel.show();
        } catch (error) {
            this.server = null;
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.outputChannel.appendLine(`✗ Failed to start server: ${errorMessage}`);
            throw error;
        }
    }

    private async checkPortOccupied(port: number): Promise<boolean> {
        return new Promise((resolve) => {
            const server = net.createServer();

            server.once('error', (err: NodeJS.ErrnoException) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });

            server.once('listening', () => {
                server.close();
                resolve(false);
            });

            server.listen(port, 'localhost');
        });
    }

    private async killProcessOnPort(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            let command: string;

            if (process.platform === 'win32') {
                command = `for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /F /PID %a`;
            } else {
                command = `lsof -ti:${port} | xargs kill -9`;
            }

            child_process.exec(command, (error) => {
                if (error) {
                    this.outputChannel.appendLine(`Failed to kill process on port ${port}: ${error.message}`);
                    reject(error);
                } else {
                    this.outputChannel.appendLine(`Killed process on port ${port}`);
                    resolve();
                }
            });
        });
    }

    public dispose(): void {
        if (this.isRunning()) {
            this.server?.stop();
            this.server = null;
        }
        this.outputChannel.dispose();
        this.statusChangeEmitter.dispose();
    }
}
