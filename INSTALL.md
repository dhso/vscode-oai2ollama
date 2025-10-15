# Installation Guide

## Quick Start

### From Source

1. **Clone and build**:
   ```bash
   cd vscode-oai2ollama
   npm install
   npm run compile
   ```

2. **Install in VSCode**:
   - Press `F5` to run in development mode, OR
   - Run `npm run package` to create a `.vsix` file
   - In VSCode: Extensions → `...` → Install from VSIX

3. **Configure**:
   - Open Settings (`Ctrl+,` / `Cmd+,`)
   - Search for "oai2ollama"
   - Set your `apiKey` and `baseUrl`

4. **Start**:
   - Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
   - Run: `Oai2Ollama: Start Service`

## Configuration Example

```json
{
  "oai2ollama.apiKey": "sk-your-api-key",
  "oai2ollama.baseUrl": "https://api.openai.com/v1",
  "oai2ollama.port": 11434,
  "oai2ollama.autoStart": true
}
```

## Verify Installation

After starting the service, test with:

```bash
# List models
curl http://localhost:11434/api/tags

# Get version
curl http://localhost:11434/api/version
```

## Using with GitHub Copilot

Unfortunately, GitHub Copilot in VSCode doesn't currently support custom Ollama servers. However, you can use this extension with other tools that support Ollama API:

- **Continue.dev**: Configure Ollama provider with `http://localhost:11434`
- **Open Interpreter**: Use `--api-base http://localhost:11434`
- **Any Ollama-compatible client**: Point to `http://localhost:11434`

## Troubleshooting

### Port in use
The extension will automatically detect and offer to kill the process. Or change the port in settings.

### API key not working
- Check if the API key is correct
- Verify the base URL is correct (should include `/v1` if needed)
- Check the Output channel for detailed error messages

### Service won't start
- Check the Output channel (`Oai2Ollama`) for error messages
- Ensure your firewall allows local connections on the configured port
- Verify Node.js types are installed: `npm i --save-dev @types/node`
