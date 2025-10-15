# Contributing Guide

Thank you for your interest in contributing to the Oai2Ollama VSCode Extension! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 20.x or later
- npm (comes with Node.js)
- VSCode 1.85.0 or later
- Git

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CNSeniorious000/oai2ollama.git
   cd oai2ollama/vscode-oai2ollama
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile TypeScript**:
   ```bash
   npm run compile
   ```

4. **Open in VSCode**:
   ```bash
   code .
   ```

5. **Start debugging**:
   - Press `F5` to launch Extension Development Host
   - Test your changes in the new window

### Project Structure

```
src/
├── extension.ts    # Extension entry point
├── server.ts       # HTTP server implementation
├── service.ts      # Service lifecycle management
└── statusBar.ts    # Status bar UI integration
```

See [PROJECT.md](PROJECT.md) for detailed architecture documentation.

## Development Workflow

### Making Changes

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Edit TypeScript files in `src/`
   - Follow the existing code style
   - Add comments for complex logic

3. **Compile and test**:
   ```bash
   npm run compile
   # Press F5 in VSCode to test
   ```

4. **Test thoroughly**:
   - Test all affected features
   - Test error cases
   - Test on different platforms if possible

### Code Style

This project uses ESLint and TypeScript strict mode. Follow these guidelines:

#### TypeScript
- Use explicit types where possible
- Avoid `any` type
- Use async/await for asynchronous code
- Handle errors properly

#### Naming Conventions
- Classes: `PascalCase`
- Functions/methods: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Private members: prefix with `_` (e.g., `_privateMethod`)

#### Example

```typescript
// Good
export class Oai2OllamaServer {
    private _config: ServerConfig;

    public async start(): Promise<void> {
        // Implementation
    }
}

// Avoid
export class server {
    public config: any;

    public start() {
        // No return type, no async/await
    }
}
```

### Linting

Run ESLint before committing:

```bash
npm run lint
```

Fix linting issues automatically where possible:

```bash
npm run lint -- --fix
```

## Testing

### Manual Testing

1. **Start Extension Development Host** (F5)
2. **Test each command**:
   - Start Service
   - Stop Service
   - Restart Service
   - Show Status
   - Open Settings

3. **Test API endpoints**:
   ```bash
   # After starting service
   curl http://localhost:11434/api/tags
   curl http://localhost:11434/api/version
   curl http://localhost:11434/v1/models
   ```

4. **Test edge cases**:
   - Port conflicts
   - Invalid configuration
   - Network errors
   - Configuration changes while running

### Testing Checklist

- [ ] Service starts successfully
- [ ] Service stops cleanly
- [ ] Port conflict detection works
- [ ] Status bar updates correctly
- [ ] Configuration changes prompt restart
- [ ] All API endpoints respond correctly
- [ ] Streaming works properly
- [ ] Error messages are helpful
- [ ] Output channel shows logs

## Adding Features

### 1. Plan Your Feature

- Open an issue to discuss the feature first
- Get feedback from maintainers
- Consider edge cases and error handling

### 2. Implement the Feature

Follow this checklist:

- [ ] Add code with proper types
- [ ] Handle errors gracefully
- [ ] Add logging to output channel
- [ ] Update UI if needed (status bar, notifications)
- [ ] Test thoroughly

### 3. Update Documentation

- [ ] Update [README.md](README.md)
- [ ] Update [README_CN.md](README_CN.md) if needed
- [ ] Add to [CHANGELOG.md](CHANGELOG.md)
- [ ] Update [PROJECT.md](PROJECT.md) if architecture changed
- [ ] Add examples if applicable

### 4. Submit Pull Request

- [ ] Commit with clear message
- [ ] Push to your fork
- [ ] Create pull request with description
- [ ] Link related issues
- [ ] Wait for review

## Fixing Bugs

### 1. Reproduce the Bug

- Get clear steps to reproduce
- Identify the affected component
- Check error logs

### 2. Fix the Bug

- Write a fix with minimal changes
- Add error handling if missing
- Test the fix thoroughly
- Test that it doesn't break other features

### 3. Document the Fix

- Add to [CHANGELOG.md](CHANGELOG.md)
- Update documentation if needed
- Include reproduction steps in commit message

## Documentation

### Updating Documentation

When updating docs, consider:

- **README.md**: End-user documentation
- **README_CN.md**: Chinese translation
- **PROJECT.md**: Technical/architectural docs
- **CHANGELOG.md**: Version history
- **CAPABILITIES.md**: Capability reference

### Writing Guidelines

- Use clear, concise language
- Include code examples
- Add screenshots if helpful
- Keep formatting consistent
- Test all code examples

## Commit Messages

Follow this format:

```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```
feat(server): add support for custom headers

Added ability to configure custom headers for upstream requests.
This allows users to add authentication headers or other metadata.

Closes #123
```

```
fix(service): handle port conflict on Windows

The port conflict detection was failing on Windows due to
different command syntax. Updated to use correct netstat format.

Fixes #456
```

## Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Update documentation**
6. **Submit pull request**
7. **Address review comments**
8. **Wait for merge**

### PR Checklist

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Commit messages are clear
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] TypeScript types are proper

## Code Review

### As a Reviewer

- Be constructive and respectful
- Test the changes locally
- Check for edge cases
- Verify documentation
- Suggest improvements

### As a Contributor

- Respond to feedback promptly
- Don't take criticism personally
- Ask questions if unclear
- Update based on feedback
- Thank reviewers

## Release Process

1. Update version in `package.json`
2. Update [CHANGELOG.md](CHANGELOG.md)
3. Commit: `chore: bump version to X.Y.Z`
4. Create git tag: `git tag vX.Y.Z`
5. Push with tags: `git push --tags`
6. Build: `npm run package`
7. Publish to VSCode Marketplace

## Getting Help

- 📖 Read [PROJECT.md](PROJECT.md) for architecture
- 💬 Ask questions in issues
- 🐛 Report bugs with logs
- 💡 Suggest features with use cases

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn
- Keep discussions professional

## Recognition

Contributors will be:
- Listed in release notes
- Credited in documentation
- Thanked publicly

## Resources

- [VSCode Extension API](https://code.visualstudio.com/api)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js HTTP Module](https://nodejs.org/api/http.html)
- [Ollama API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md)

## Common Tasks

### Add a new command

1. Add command to `package.json`:
   ```json
   {
     "command": "oai2ollama.myCommand",
     "title": "Oai2Ollama: My Command"
   }
   ```

2. Register in `extension.ts`:
   ```typescript
   context.subscriptions.push(
       vscode.commands.registerCommand('oai2ollama.myCommand', async () => {
           // Implementation
       })
   );
   ```

### Add a new endpoint

1. Add handler in `server.ts`:
   ```typescript
   private async handleMyEndpoint(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
       // Implementation
   }
   ```

2. Add route in `handleRequest`:
   ```typescript
   if (url === '/my/endpoint' && method === 'GET') {
       await this.handleMyEndpoint(req, res);
   }
   ```

### Add a new configuration

1. Add to `package.json`:
   ```json
   "oai2ollama.myConfig": {
       "type": "string",
       "default": "value",
       "description": "My configuration"
   }
   ```

2. Use in code:
   ```typescript
   const config = vscode.workspace.getConfiguration('oai2ollama');
   const myValue = config.get<string>('myConfig');
   ```

## Questions?

Don't hesitate to ask! Open an issue with the `question` label.

---

**Thank you for contributing! 🎉**
