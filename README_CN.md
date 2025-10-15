# Oai2Ollama VSCode 插件

中文 | [English](README.md)

这是一个 VSCode 插件，提供**集成的 HTTP 服务器**，将 OpenAI 兼容的 API 封装并暴露为 Ollama 兼容的 API。这使得只支持 Ollama 的编程助手（如 VSCode 中的 GitHub Copilot）能够使用自定义的 OpenAI 兼容 API。

## 功能特性

- **集成 HTTP 服务器**：无需外部依赖 - 服务器直接在插件中运行
- **启动/停止/重启服务**：使用简单命令控制服务
- **端口占用检测**：自动检测并处理端口冲突
- **状态栏集成**：在状态栏一目了然地查看服务状态
- **配置管理**：通过 VSCode 设置配置所有选项
- **自动启动**：可选择在 VSCode 启动时自动启动服务
- **输出通道**：在专用输出通道查看服务日志和请求
- **完整 API 兼容性**：实现了 Ollama 和 OpenAI v1 端点

## 系统要求

**无需外部依赖！** 插件包含了实现所有 oai2ollama 功能的内置 HTTP 服务器。

## 配置项

### 必需配置

- `oai2ollama.apiKey`：用于身份验证的 API 密钥（或设置 `OPENAI_API_KEY` 环境变量）
- `oai2ollama.baseUrl`：OpenAI 兼容 API 的基础 URL（或设置 `OPENAI_BASE_URL` 环境变量）

### 可选配置

- `oai2ollama.host`：API 服务器的 IP/主机名（默认：`localhost`）
- `oai2ollama.port`：API 服务器的端口（默认：`11434`）
- `oai2ollama.capabilities`：标记模型支持的额外能力
  - 可选项：`tools`、`insert`、`vision`、`embedding`、`thinking`、`completion`
  - **注意**：`completion` 能力总是自动包含，即使不指定
  - 这些与 Ollama 当前使用的能力匹配
  - 查看 [CAPABILITIES.md](CAPABILITIES.md) 了解详细说明和示例
- `oai2ollama.models`：在 `/api/tags` 响应中包含的额外模型
  - 适用于上游 `/models` 端点未返回的模型
- `oai2ollama.autoStart`：VSCode 启动时自动启动服务（默认：`false`）

## 命令

从命令面板（`Ctrl+Shift+P` / `Cmd+Shift+P`）访问这些命令：

- `Oai2Ollama: Start Service` - 启动集成服务器
- `Oai2Ollama: Stop Service` - 停止运行的服务器
- `Oai2Ollama: Restart Service` - 重启服务器
- `Oai2Ollama: Show Status` - 显示详细的服务状态和可用端点
- `Oai2Ollama: Open Settings` - 打开插件设置

## 使用方法

### 初始设置

1. 安装插件
2. 打开 VSCode 设置（`Ctrl+,` / `Cmd+,`）
3. 搜索 "oai2ollama"
4. 配置你的 API 密钥和基础 URL
5. 使用 `Oai2Ollama: Start Service` 命令启动服务

### 状态栏

状态栏显示当前服务状态：

- ✓ **Oai2Ollama :11434** - 服务正在端口 11434 上运行
- ⊘ **Oai2Ollama** - 服务已停止（警告背景）

**点击状态栏项目**可打开快速操作菜单，提供以下选项：
- **启动服务**（停止时显示）
- **停止服务**（运行时显示）
- **重启服务**（运行时显示）
- **显示状态** - 查看详细状态信息
- **打开设置** - 配置插件

无需使用命令面板，即可快速访问所有控制功能。

### 端口冲突处理

如果配置的端口已被占用，插件将：

1. 在尝试启动时检测冲突
2. 提示你终止占用端口的进程
3. 终止冲突进程后自动重试

### 配置更改

当服务运行时修改插件设置：

1. 插件检测配置更改
2. 提示你重启服务以应用更改
3. 你可以选择立即重启或稍后重启

## API 端点

启动后，服务器暴露以下端点：

### Ollama 兼容端点

- `GET /api/tags` - 以 Ollama 格式列出可用模型
- `POST /api/show` - 显示模型能力
- `GET /api/version` - 获取 Ollama 版本信息（返回 0.11.4）

### OpenAI 兼容端点

- `GET /v1/models` - 列出可用模型（从上游代理）
- `POST /v1/chat/completions` - 聊天补全（支持流式传输）

## 配置示例

添加到你的 VSCode `settings.json`：

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

或使用环境变量：

```bash
export OPENAI_API_KEY=your-api-key-here
export OPENAI_BASE_URL=https://api.example.com/v1/
```

## 工作原理

插件运行一个集成的 HTTP 服务器，该服务器：

1. **接收请求**：在配置的端口上（默认：11434）
2. **转换 Ollama API 调用**：转换为 OpenAI 兼容格式
3. **代理请求**：转发到你配置的 OpenAI 兼容 API
4. **返回响应**：以适当的格式（Ollama 或 OpenAI）

对于流式聊天补全，服务器直接代理 SSE 流，无需修改。

## 与 GitHub Copilot 一起使用

要在 VSCode 中将此插件与 GitHub Copilot 一起使用：

1. 在此插件中启动 oai2ollama 服务
2. 配置 Copilot 使用 Ollama，URL 为：`http://localhost:11434`
3. 你的自定义 OpenAI API 现在可以通过 Copilot 访问！

## 常见模型配置

### GPT-4 / GPT-4 Turbo
```json
{
  "oai2ollama.apiKey": "sk-your-openai-key",
  "oai2ollama.baseUrl": "https://api.openai.com/v1/",
  "oai2ollama.capabilities": ["tools", "vision"]
}
```

### Claude 3 (Opus/Sonnet/Haiku)
```json
{
  "oai2ollama.apiKey": "sk-ant-your-anthropic-key",
  "oai2ollama.baseUrl": "https://api.anthropic.com/v1/",
  "oai2ollama.capabilities": ["tools", "vision"]
}
```

### Claude 3.5 带思考能力
```json
{
  "oai2ollama.apiKey": "sk-ant-your-anthropic-key",
  "oai2ollama.baseUrl": "https://api.anthropic.com/v1/",
  "oai2ollama.capabilities": ["tools", "vision", "thinking"]
}
```

### 国内 API 服务（如 DeepSeek）
```json
{
  "oai2ollama.apiKey": "your-deepseek-key",
  "oai2ollama.baseUrl": "https://api.deepseek.com/v1/",
  "oai2ollama.capabilities": ["tools"]
}
```

### 自定义模型
```json
{
  "oai2ollama.apiKey": "your-api-key",
  "oai2ollama.baseUrl": "https://your-custom-api.com/v1/",
  "oai2ollama.capabilities": ["tools"],
  "oai2ollama.models": ["custom-model-1", "custom-model-2"]
}
```

## 开发

### 从源码构建

```bash
cd vscode-oai2ollama
npm install
npm run compile
```

### 开发模式运行

1. 在 VSCode 中打开 `vscode-oai2ollama` 文件夹
2. 按 `F5` 开始调试
3. 将打开一个新的扩展开发主机窗口

### 打包

```bash
npm run package
```

这将创建一个 `.vsix` 文件，可以通过 VSCode 的"从 VSIX 安装"手动安装。

## 故障排除

### 服务无法启动

- 确保已配置 API 密钥和基础 URL
- 检查输出通道以查看详细的错误消息
- 验证上游 API 是否可访问

### 端口已被占用

- 插件将检测到这一点并提供终止冲突进程的选项
- 或者，在设置中更改端口以使用其他端口

### 配置未应用

- 确保在更改设置后重启服务
- 检查输出通道以查看任何配置错误

### 连接超时

- 服务器对上游请求使用 60 秒超时
- 如果你的 API 响应慢，请求可能会超时
- 检查网络连接和 API 可用性

### 无法访问某些模型

- 使用 `oai2ollama.models` 配置添加上游 API 未返回的模型
- 确保 API 密钥有权限访问这些模型

## 架构

插件由三个主要组件组成：

1. **Server** ([server.ts](src/server.ts))：实现 Ollama 和 OpenAI 端点的 HTTP 服务器
2. **Service** ([service.ts](src/service.ts))：管理服务器生命周期、端口检测、配置
3. **Status Bar** ([statusBar.ts](src/statusBar.ts))：显示服务状态的 UI 集成

## 技术特点

- **纯 Node.js 实现**：使用原生 `http`/`https` 模块，无需额外依赖
- **流式代理**：直接转发 Server-Sent Events (SSE) 流
- **智能端口管理**：自动检测和清理端口占用
- **跨平台支持**：支持 Windows、Linux、macOS
- **配置热重载**：配置更改时自动提示重启

## 与原版 oai2ollama 的对比

| 特性 | 原版 (Python) | 此插件 (VSCode) |
|------|--------------|----------------|
| 运行方式 | 命令行工具 | VSCode 集成 |
| 依赖 | Python 3.12+, uv | 无（内置） |
| 配置方式 | CLI 参数/.env | VSCode 设置 |
| 启动方式 | 手动运行命令 | VSCode 命令/自动启动 |
| 日志查看 | 终端 | VSCode 输出通道 |
| 状态监控 | 需手动检查 | 状态栏集成 |
| 端口冲突 | 手动处理 | 自动检测和处理 |

## 许可证

此插件按原样提供，用于 oai2ollama 项目。

## 相关链接

- [oai2ollama GitHub 仓库](https://github.com/CNSeniorious000/oai2ollama)
- [报告问题](https://github.com/CNSeniorious000/oai2ollama/issues)
- [English README](README.md)
- [能力说明文档](CAPABILITIES.md)
- [安装指南](INSTALL.md)

## 常见问题

### 为什么需要这个插件？

某些 AI 编程助手（如 GitHub Copilot）只支持 Ollama API，但你可能想使用其他 OpenAI 兼容的 API（如 Claude、GPT-4、国内大模型等）。这个插件充当中间层，让你可以在这些工具中使用任何 OpenAI 兼容的 API。

### 支持哪些 API？

任何 OpenAI 兼容的 API，包括：
- OpenAI 官方 API
- Anthropic Claude (通过兼容层)
- DeepSeek
- 智谱 ChatGLM
- 通义千问
- 其他提供 OpenAI 兼容接口的服务

### 数据安全吗？

是的。所有请求都在本地处理，只有实际的 API 调用会发送到上游服务器。你的 API 密钥安全地存储在 VSCode 设置中。

### 性能如何？

插件使用高效的流式代理，几乎没有延迟。HTTP/2 支持确保了最佳的网络性能。

### 可以同时运行多个实例吗？

只要使用不同的端口，可以在同一台机器上运行多个实例。每个 VSCode 窗口可以有自己的插件实例。
