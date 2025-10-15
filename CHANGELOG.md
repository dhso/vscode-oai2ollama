# Change Log

## [0.1.1] - Unreleased

### Added
- **Interactive Status Bar** - Click status bar to open quick action menu
  - Start/Stop/Restart service
  - Show status information
  - Open settings
  - Context-aware menu items based on service state

### Changed
- Improved status bar tooltip to indicate clickable actions

## [0.1.0] - Initial Release

### Features

- **Integrated HTTP server** - No external dependencies, server runs directly in extension
- Start/Stop/Restart oai2ollama service from VSCode
- Configuration management through VSCode settings
- Port occupancy detection and conflict resolution
- Status bar integration showing service status
- Auto-start option
- Output channel for service logs
- Full support for all oai2ollama configuration options:
  - API key and base URL
  - Host and port configuration
  - Capabilities (tools, insert, vision, embedding, thinking, completion)
    - `completion` capability is always included automatically
  - Extra models support for models not returned by upstream API
- Complete API endpoint implementation:
  - Ollama-compatible: `/api/tags`, `/api/show`, `/api/version`
  - OpenAI-compatible: `/v1/models`, `/v1/chat/completions` (with streaming)
