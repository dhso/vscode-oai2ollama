# Model Capabilities

This document explains the model capabilities supported by the oai2ollama extension.

## Overview

Model capabilities are metadata flags that indicate what features a model supports. These are used by Ollama-compatible clients to determine which operations they can perform with a model.

## Available Capabilities

The extension supports the following capabilities, which match those currently used by Ollama:

| Capability | Description | Example Use Case |
|------------|-------------|------------------|
| `completion` | Text completion | Standard chat and text generation (always included) |
| `tools` | Function/tool calling | Models that support function calling (e.g., GPT-4, Claude 3) |
| `insert` | Fill-in-the-middle | Code completion in the middle of files |
| `vision` | Image understanding | Models that can process images (e.g., GPT-4 Vision, Claude 3) |
| `embedding` | Text embeddings | Models that generate embeddings |
| `thinking` | Reasoning/chain-of-thought | Models with extended reasoning capabilities |

## Configuration

Configure capabilities in your VSCode settings:

```json
{
  "oai2ollama.capabilities": ["tools", "vision", "thinking"]
}
```

## Automatic Inclusion

The `completion` capability is **always included automatically**, even if you don't specify it. This is because all language models support basic text completion.

### Example

If you configure:
```json
{
  "oai2ollama.capabilities": ["tools", "vision"]
}
```

The server will actually report capabilities as:
```json
["completion", "tools", "vision"]
```

## How It Works

When a client queries the `/api/show` endpoint, the server returns:

```json
{
  "model_info": {
    "general.architecture": "CausalLM"
  },
  "capabilities": ["completion", "tools", "vision"]
}
```

Clients use this information to:
1. Enable/disable UI features
2. Determine which API parameters to send
3. Validate model compatibility

## Common Configurations

### GPT-4 / GPT-4 Turbo
```json
{
  "oai2ollama.capabilities": ["tools", "vision"]
}
```

### Claude 3 (Opus/Sonnet/Haiku)
```json
{
  "oai2ollama.capabilities": ["tools", "vision"]
}
```

### Claude 3.5 with thinking
```json
{
  "oai2ollama.capabilities": ["tools", "vision", "thinking"]
}
```

### GPT-3.5 Turbo
```json
{
  "oai2ollama.capabilities": ["tools"]
}
```

### Text Embedding Models
```json
{
  "oai2ollama.capabilities": ["embedding"]
}
```

### Code Completion Models (with FIM)
```json
{
  "oai2ollama.capabilities": ["insert"]
}
```

## References

- [Ollama Capabilities Source Code](https://github.com/ollama/ollama/blob/main/types/model/capability.go#L6-L11)
- The oai2ollama extension implements the same capability system as the original Python package
