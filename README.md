# Oai2Ollama VSCode Extension

[中文文档](README_CN.md) | English

This VSCode extension provides an **integrated server** that wraps an OpenAI-compatible API and exposes an Ollama-compatible API directly within VSCode. This enables coding agents that only support Ollama (like GitHub Copilot for VS Code) to use custom OpenAI-compatible APIs.

## Features

- **Integrated HTTP Server**: No external dependencies - the server runs directly in the extension
- **Start/Stop/Restart Service**: Control the service with simple commands
- **Port Occupancy Detection**: Automatically detect and handle port conflicts
- **Status Bar Integration**: See service status at a glance in the status bar
- **Configuration Management**: Configure all settings through VSCode settings
- **Auto-start**: Optionally start the service automatically when VSCode launches
- **Output Channel**: View service logs and requests in a dedicated output channel
- **Full API Compatibility**: Implements both Ollama and OpenAI v1 endpoints

## Requirements

**No external dependencies required!** The extension includes a built-in HTTP server that implements all oai2ollama functionality.

## Extension Settings

### Required Settings

- `oai2ollama.apiKey`: API key for authentication (or set `OPENAI_API_KEY` environment variable)
- `oai2ollama.baseUrl`: Base URL for the OpenAI-compatible API (or set `OPENAI_BASE_URL` environment variable)

### Optional Settings

- `oai2ollama.host`: IP/hostname for the API server (default: `localhost`)
- `oai2ollama.port`: Port for the API server (default: `11434`)
- `oai2ollama.capabilities`: Extra capabilities to mark the model as supporting
  - Available options: `tools`, `insert`, `vision`, `embedding`, `thinking`, `completion`
  - **Note**: The `completion` capability is always included automatically, even if not specified
  - These match the capabilities currently used by Ollama
  - See [CAPABILITIES.md](CAPABILITIES.md) for detailed explanations and examples
- `oai2ollama.models`: Extra models to include in the `/api/tags` response
  - Useful for models not returned by the upstream `/models` endpoint
- `oai2ollama.autoStart`: Automatically start service when VSCode starts (default: `false`)

## Commands

Access these commands from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- `Oai2Ollama: Start Service` - Start the integrated server
- `Oai2Ollama: Stop Service` - Stop the running server
- `Oai2Ollama: Restart Service` - Restart the server
- `Oai2Ollama: Show Status` - Display detailed service status and available endpoints
- `Oai2Ollama: Open Settings` - Open extension settings

## Usage

### Initial Setup

1. Install the extension
2. Open VSCode settings (`Ctrl+,` / `Cmd+,`)
3. Search for "oai2ollama"
4. Configure your API key and base URL
5. Start the service using `Oai2Ollama: Start Service` command

### Status Bar

The status bar shows the current service status:

- ✓ **Oai2Ollama :11434** - Service is running on port 11434
- ⊘ **Oai2Ollama** - Service is stopped (warning background)

**Click the status bar item** to open a quick action menu with options to:
- **Start Service** (when stopped)
- **Stop Service** (when running)
- **Restart Service** (when running)
- **Show Status** - View detailed status information
- **Open Settings** - Configure the extension

This provides quick access to all controls without using the command palette.

### Port Conflict Handling

If the configured port is already in use, the extension will:

1. Detect the conflict when attempting to start
2. Prompt you to kill the process using the port
3. Automatically retry after killing the conflicting process

### Configuration Changes

When you modify extension settings while the service is running:

1. The extension detects the configuration change
2. Prompts you to restart the service to apply changes
3. You can choose to restart immediately or later

## API Endpoints

Once started, the server exposes the following endpoints:

### Ollama-Compatible Endpoints

- `GET /api/tags` - List available models in Ollama format
- `POST /api/show` - Show model capabilities
- `GET /api/version` - Get Ollama version info (returns 0.11.4)

### OpenAI-Compatible Endpoints

- `GET /v1/models` - List available models (proxied from upstream)
- `POST /v1/chat/completions` - Chat completions (supports streaming)

## Example Configuration

Add to your VSCode `settings.json`:

```json
{
  "oai2ollama.apiKey": "your-api-key-here",
  "oai2ollama.baseUrl": "https://api.example.com/v1/",
  "oai2ollama.host": "localhost",
  "oai2ollama.port": 11434,
  "oai2ollama.capabilities": ["tools", "vision"],
  "oai2ollama.models": ["custom-model-1", "custom-model-2"],
  "oai2ollama.autoStart": true
}
```

Or use environment variables:

```bash
export OPENAI_API_KEY=your-api-key-here
export OPENAI_BASE_URL=https://api.example.com/v1/
```

## How It Works

The extension runs an integrated HTTP server that:

1. **Receives requests** on the configured port (default: 11434)
2. **Translates Ollama API calls** to OpenAI-compatible format
3. **Proxies requests** to your configured OpenAI-compatible API
4. **Returns responses** in the appropriate format (Ollama or OpenAI)

For streaming chat completions, the server proxies the SSE stream directly without modification.

## Using with GitHub Copilot

To use this extension with GitHub Copilot in VSCode:

1. Start the oai2ollama service in this extension
2. Configure Copilot to use Ollama with URL: `http://localhost:11434`
3. Your custom OpenAI API will now be accessible through Copilot!

## Development

### Building from Source

```bash
cd vscode-oai2ollama
npm install
npm run compile
```

### Running in Development

1. Open the `vscode-oai2ollama` folder in VSCode
2. Press `F5` to start debugging
3. A new Extension Development Host window will open

### Packaging

```bash
npm run package
```

This creates a `.vsix` file that can be installed manually via "Install from VSIX" in VSCode.

## Troubleshooting

### Service won't start

- Ensure API key and base URL are configured
- Check the output channel for detailed error messages
- Verify the upstream API is accessible

### Port already in use

- The extension will detect this and offer to kill the conflicting process
- Alternatively, change the port in settings to use a different port

### Configuration not applied

- Make sure to restart the service after changing settings
- Check the output channel for any configuration errors

### Connection timeout

- The server uses a 60-second timeout for upstream requests
- If your API is slow, requests may timeout
- Check your network connection and API availability

## Architecture

The extension consists of three main components:

1. **Server** ([server.ts](src/server.ts)): HTTP server implementing Ollama and OpenAI endpoints
2. **Service** ([service.ts](src/service.ts)): Manages server lifecycle, port detection, configuration
3. **Status Bar** ([statusBar.ts](src/statusBar.ts)): UI integration showing service status

## License

This extension is provided as-is for use with the oai2ollama project.

## Links

- [oai2ollama GitHub Repository](https://github.com/CNSeniorious000/oai2ollama)
- [Report Issues](https://github.com/CNSeniorious000/oai2ollama/issues)
- [中文文档 (Chinese Documentation)](README_CN.md)
- [Capabilities Documentation](CAPABILITIES.md)
- [Installation Guide](INSTALL.md)
