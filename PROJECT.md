# Project Structure

This document provides an overview of the VSCode extension project structure and architecture.

## Directory Structure

```
vscode-oai2ollama/
├── src/                      # Source code
│   ├── extension.ts         # Extension entry point
│   ├── server.ts            # HTTP server implementation
│   ├── service.ts           # Service lifecycle management
│   └── statusBar.ts         # Status bar UI integration
├── out/                     # Compiled JavaScript (generated)
├── node_modules/            # Dependencies (generated)
├── package.json             # Extension manifest and dependencies
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.json          # ESLint configuration
├── .vscodeignore           # Files to exclude from package
├── .gitignore              # Git ignore patterns
├── README.md               # English documentation
├── README_CN.md            # Chinese documentation
├── CHANGELOG.md            # Version history
├── CAPABILITIES.md         # Model capabilities documentation
├── INSTALL.md              # Installation guide
└── PROJECT.md              # This file
```

## Core Components

### 1. Extension ([extension.ts](src/extension.ts))

**Responsibilities:**
- Extension activation and deactivation
- Command registration
- Configuration change handling
- Auto-start logic

**Key Functions:**
- `activate()`: Initializes service and status bar, registers commands
- `deactivate()`: Cleanup on extension unload

**Commands Registered:**
- `oai2ollama.start`: Start the service
- `oai2ollama.stop`: Stop the service
- `oai2ollama.restart`: Restart the service
- `oai2ollama.showStatus`: Display detailed status
- `oai2ollama.openSettings`: Open extension settings

### 2. Server ([server.ts](src/server.ts))

**Responsibilities:**
- HTTP server implementation
- Request routing
- API endpoint handlers
- Upstream API communication

**Key Classes:**
- `Oai2OllamaServer`: Main server class

**API Endpoints:**
- `GET /api/tags`: List models in Ollama format
- `POST /api/show`: Show model capabilities
- `GET /api/version`: Return Ollama version
- `GET /v1/models`: Proxy to upstream models endpoint
- `POST /v1/chat/completions`: Proxy chat completions (streaming supported)

**Key Features:**
- Native Node.js HTTP server
- CORS support
- Streaming response proxying
- 60-second timeout for upstream requests

### 3. Service ([service.ts](src/service.ts))

**Responsibilities:**
- Server lifecycle management
- Port occupancy detection
- Configuration validation
- Process management
- Logging to output channel

**Key Classes:**
- `Oai2OllamaService`: Service manager

**Key Methods:**
- `start()`: Start the server with port conflict detection
- `stop()`: Stop the running server
- `restart()`: Restart the server
- `showStatus()`: Display detailed status information
- `checkPortOccupied()`: Check if port is available
- `killProcessOnPort()`: Kill process occupying a port (cross-platform)

### 4. Status Bar ([statusBar.ts](src/statusBar.ts))

**Responsibilities:**
- Display service status in VSCode status bar
- Update UI on status changes
- Provide quick access to status information

**Key Classes:**
- `StatusBarManager`: Status bar manager

**Visual States:**
- Running: ✓ Oai2Ollama :PORT (normal background)
- Stopped: ⊘ Oai2Ollama (warning background)

## Data Flow

### Starting the Service

```
User clicks "Start Service"
  ↓
Extension.ts receives command
  ↓
Service.ts validates configuration
  ↓
Service.ts checks port availability
  ↓ (if occupied)
Prompts user to kill process
  ↓
Service.ts creates Server instance
  ↓
Server.ts starts HTTP server
  ↓
StatusBar.ts updates UI
  ↓
Output channel shows success message
```

### Handling API Request

```
Client sends request to http://localhost:11434/api/tags
  ↓
Server.ts receives request
  ↓
Routes to handleApiTags()
  ↓
Makes upstream request to /models
  ↓
Merges with extra models from config
  ↓
Formats response in Ollama format
  ↓
Returns JSON response to client
```

### Streaming Chat Completion

```
Client sends POST to /v1/chat/completions with stream=true
  ↓
Server.ts receives request
  ↓
Routes to handleV1ChatCompletions()
  ↓
Detects streaming request
  ↓
Opens persistent connection to upstream
  ↓
Proxies SSE chunks directly to client
  ↓
Connection maintained until complete
```

## Configuration Flow

```
VSCode Settings
  ↓
vscode.workspace.getConfiguration('oai2ollama')
  ↓
Service.ts reads config
  ↓
Validates required fields (apiKey, baseUrl)
  ↓
Passes to Server constructor
  ↓
Server uses config for all operations
```

## Event Flow

### Configuration Change

```
User modifies settings
  ↓
onDidChangeConfiguration event fires
  ↓
Extension.ts checks if service is running
  ↓ (if running)
Prompts user to restart
  ↓ (if user accepts)
Service.ts restarts with new config
```

### Status Change

```
Server starts/stops
  ↓
Service.ts fires statusChangeEmitter
  ↓
StatusBar.ts receives event
  ↓
Updates status bar display
```

## Build Process

1. **Development**:
   ```bash
   npm install          # Install dependencies
   npm run compile      # Compile TypeScript to JavaScript
   ```

2. **Watch Mode**:
   ```bash
   npm run watch        # Auto-compile on file changes
   ```

3. **Packaging**:
   ```bash
   npm run package      # Create .vsix file
   ```

## Extension Activation

The extension activates on VSCode startup (`onStartupFinished`), ensuring:
- Minimal impact on startup time
- Commands available immediately after startup
- Auto-start works correctly if enabled

## Error Handling

### Configuration Errors
- Validates required fields before starting
- Shows error message with option to open settings
- Logs detailed errors to output channel

### Port Conflicts
- Detects conflicts before starting
- Offers to kill conflicting process
- Re-validates after killing process

### Upstream API Errors
- Catches HTTP errors from upstream
- Returns appropriate error responses
- Logs errors to output channel

### Network Errors
- 60-second timeout for all upstream requests
- Handles connection failures gracefully
- Shows user-friendly error messages

## Testing Strategy

### Manual Testing
1. Start service with valid config
2. Test each API endpoint with curl
3. Test port conflict detection
4. Test configuration changes
5. Test auto-start feature

### Extension Testing
1. Press F5 to launch Extension Development Host
2. Run commands from command palette
3. Check output channel for logs
4. Verify status bar updates

### API Testing
```bash
# Test Ollama endpoints
curl http://localhost:11434/api/tags
curl http://localhost:11434/api/version
curl -X POST http://localhost:11434/api/show

# Test OpenAI endpoints
curl http://localhost:11434/v1/models
curl -X POST http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hello"}]}'
```

## Performance Considerations

### Memory Usage
- Server runs in extension process
- No child processes spawned
- Minimal memory overhead (~10-20MB)

### Network Performance
- HTTP/2 support for upstream requests
- Direct streaming without buffering
- Connection pooling for efficiency

### Startup Time
- Lazy initialization (only on first command)
- No blocking operations on activation
- Auto-start happens after VSCode fully loads

## Security Considerations

### API Key Storage
- Stored in VSCode settings
- Can use environment variables instead
- Never logged or exposed in UI (shown as ***)

### Network Security
- All communication over HTTPS to upstream
- CORS enabled for local development
- No external network access except to configured upstream

### Process Isolation
- Runs in VSCode extension host
- No elevated privileges required
- Port killing requires appropriate OS permissions

## Future Enhancements

Potential areas for improvement:
- [ ] Request/response logging toggle
- [ ] Multiple upstream API support
- [ ] Custom endpoint mappings
- [ ] Rate limiting
- [ ] Caching layer
- [ ] Health check endpoint
- [ ] Metrics and monitoring
- [ ] WebSocket support
- [ ] Authentication middleware
