# Quick Start Guide

Get started with the Oai2Ollama VSCode extension in 5 minutes.

## Installation

### Option 1: From Source (Recommended for Development)

```bash
# 1. Clone or navigate to the extension directory
cd vscode-oai2ollama

# 2. Install dependencies
npm install

# 3. Compile TypeScript
npm run compile

# 4. Open in VSCode
code .

# 5. Press F5 to launch Extension Development Host
```

### Option 2: Install from VSIX

```bash
# 1. Package the extension
npm run package

# 2. In VSCode:
#    - Open Extensions view (Ctrl+Shift+X)
#    - Click "..." menu
#    - Select "Install from VSIX..."
#    - Choose the generated .vsix file
```

## First-Time Setup

### Step 1: Configure Your API

Open VSCode Settings (`Ctrl+,` or `Cmd+,`) and search for "oai2ollama":

```json
{
  "oai2ollama.apiKey": "your-api-key-here",
  "oai2ollama.baseUrl": "https://api.openai.com/v1/"
}
```

**For popular providers:**

**OpenAI:**
```json
{
  "oai2ollama.apiKey": "sk-...",
  "oai2ollama.baseUrl": "https://api.openai.com/v1/"
}
```

**Anthropic Claude:**
```json
{
  "oai2ollama.apiKey": "sk-ant-...",
  "oai2ollama.baseUrl": "https://api.anthropic.com/v1/"
}
```

**DeepSeek:**
```json
{
  "oai2ollama.apiKey": "your-deepseek-key",
  "oai2ollama.baseUrl": "https://api.deepseek.com/v1/"
}
```

### Step 2: Start the Service

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Oai2Ollama: Start Service"
3. Press Enter

You should see:
- ✅ Success notification
- ✓ Status bar shows "Oai2Ollama :11434"
- Output channel shows startup logs

### Step 3: Verify It's Working

Test the endpoints:

```bash
# List available models
curl http://localhost:11434/api/tags

# Get version
curl http://localhost:11434/api/version

# Test chat completion
curl -X POST http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Common Configurations

### GPT-4 with Tools and Vision

```json
{
  "oai2ollama.apiKey": "sk-...",
  "oai2ollama.baseUrl": "https://api.openai.com/v1/",
  "oai2ollama.capabilities": ["tools", "vision"]
}
```

### Claude 3.5 with All Capabilities

```json
{
  "oai2ollama.apiKey": "sk-ant-...",
  "oai2ollama.baseUrl": "https://api.anthropic.com/v1/",
  "oai2ollama.capabilities": ["tools", "vision", "thinking"]
}
```

### Auto-Start on VSCode Launch

```json
{
  "oai2ollama.apiKey": "your-key",
  "oai2ollama.baseUrl": "https://api.example.com/v1/",
  "oai2ollama.autoStart": true
}
```

### Custom Port

```json
{
  "oai2ollama.port": 8080,
  "oai2ollama.host": "0.0.0.0"
}
```

### Extra Models (Not in Upstream API)

```json
{
  "oai2ollama.models": ["custom-model-1", "custom-model-2"]
}
```

## Using with Tools

### Continue.dev

1. Install Continue extension in VSCode
2. Open Continue settings
3. Add Ollama provider:
   ```json
   {
     "models": [{
       "title": "My Custom Model",
       "provider": "ollama",
       "model": "gpt-4",
       "apiBase": "http://localhost:11434"
     }]
   }
   ```

### Cline (formerly Claude Dev)

1. Install Cline extension
2. Configure custom API endpoint
3. Use `http://localhost:11434` as base URL

### Any Ollama-Compatible Client

Point the client to: `http://localhost:11434`

## Troubleshooting

### "Port 11434 is already in use"

**Solution 1:** Kill the process
- The extension will prompt you automatically
- Click "Kill Process"

**Solution 2:** Use a different port
```json
{
  "oai2ollama.port": 11435
}
```

### "Please configure API key and Base URL"

1. Open Settings (`Ctrl+,`)
2. Search "oai2ollama"
3. Fill in `apiKey` and `baseUrl`
4. Or set environment variables:
   ```bash
   export OPENAI_API_KEY=your-key
   export OPENAI_BASE_URL=https://api.example.com/v1/
   ```

### "Failed to start server"

**Check the Output channel:**
1. View → Output
2. Select "Oai2Ollama" from dropdown
3. Read error messages

**Common issues:**
- Invalid API key or base URL
- Network connectivity problems
- Firewall blocking the port

### Service stops unexpectedly

**Check logs:**
- Open Output channel (View → Output → Oai2Ollama)
- Look for error messages

**Common causes:**
- Upstream API errors
- Network timeouts
- Invalid configuration

### Configuration changes not applied

1. Stop the service: `Oai2Ollama: Stop Service`
2. Modify settings
3. Start the service: `Oai2Ollama: Start Service`

Or use: `Oai2Ollama: Restart Service`

## Next Steps

- 📖 Read the [full README](README.md) for detailed documentation
- 🌐 Check [README_CN.md](README_CN.md) for Chinese documentation
- 🎯 Learn about [capabilities](CAPABILITIES.md)
- 🏗️ Understand the [project structure](PROJECT.md)
- 💾 Review [installation options](INSTALL.md)

## Quick Commands Reference

| Command | Shortcut | Description |
|---------|----------|-------------|
| Oai2Ollama: Start Service | - | Start the server |
| Oai2Ollama: Stop Service | - | Stop the server |
| Oai2Ollama: Restart Service | - | Restart the server |
| Oai2Ollama: Show Status | - | View detailed status |
| Oai2Ollama: Open Settings | - | Open extension settings |

**Access commands:** `Ctrl+Shift+P` / `Cmd+Shift+P` → Type "Oai2Ollama"

## Status Bar

Click the status bar item to view:
- Current status (running/stopped)
- Port information
- Configuration summary
- Available endpoints

## Tips

💡 **Enable auto-start** to have the service ready when you open VSCode

💡 **Check the output channel** for detailed logs and debugging info

💡 **Use environment variables** for API keys instead of storing in settings

💡 **Click the status bar** for quick access to status information

💡 **Use capabilities** to enable features like tools and vision

## Getting Help

- 🐛 [Report issues](https://github.com/CNSeniorious000/oai2ollama/issues)
- 💬 Check the output channel for error messages
- 📚 Read the documentation files
- 🔍 Search existing issues on GitHub

---

**Ready to use? Start the service and begin coding with your custom AI! 🚀**
