# Status Bar Quick Actions

The Oai2Ollama extension provides an interactive status bar with quick access to all service controls.

## Status Indicator

The status bar item is located in the bottom-right corner of VSCode and shows:

### Running State
```
✓ Oai2Ollama :11434
```
- Green checkmark icon
- Shows the port number
- Normal background color

### Stopped State
```
⊘ Oai2Ollama
```
- Circle-slash icon
- Warning background color (orange/yellow)
- No port number shown

## Quick Action Menu

**Click the status bar item** to open an interactive menu with context-aware options.

### When Service is Stopped

The menu shows:

1. **▶ Start Service**
   - Description: `Will start on localhost:11434`
   - Action: Starts the Oai2Ollama server
   - Validates configuration before starting

2. **ℹ Show Status**
   - Description: `View detailed status information`
   - Action: Opens output channel with full status
   - Shows configuration, port availability, etc.

3. **⚙ Open Settings**
   - Description: `Configure Oai2Ollama`
   - Action: Opens VSCode settings filtered to oai2ollama
   - Quick access to all configuration options

### When Service is Running

The menu shows:

1. **⏹ Stop Service**
   - Description: `Currently running on localhost:11434`
   - Action: Stops the running server
   - Cleans up resources gracefully

2. **🔄 Restart Service**
   - Description: `Restart with current configuration`
   - Action: Stops and starts the service
   - Useful after configuration changes

3. **ℹ Show Status**
   - Description: `View detailed status information`
   - Action: Opens output channel with full status
   - Shows active endpoints and configuration

4. **⚙ Open Settings**
   - Description: `Configure Oai2Ollama`
   - Action: Opens VSCode settings
   - Quick access to modify configuration

## Visual Design

### Icons Used

- `$(check)` - Service running (checkmark)
- `$(circle-slash)` - Service stopped (circle with slash)
- `$(play)` - Start action
- `$(debug-stop)` - Stop action
- `$(debug-restart)` - Restart action
- `$(info)` - Information/status
- `$(gear)` - Settings

### Colors

- **Normal**: Default status bar background (running)
- **Warning**: Orange/yellow background (stopped)
- Automatically adapts to your VSCode theme

## Tooltip Information

Hover over the status bar item to see:

**When Running:**
```
Oai2Ollama service is running
Click for quick actions
```

**When Stopped:**
```
Oai2Ollama service is stopped
Click for quick actions
```

## Usage Examples

### Quick Start Workflow

1. **Click status bar** → Shows "Service is stopped"
2. **Select "▶ Start Service"**
3. Status bar updates to `✓ Oai2Ollama :11434`
4. Service is now running!

### Quick Restart After Config Change

1. Modify settings (e.g., change capabilities)
2. **Click status bar** → Shows current state
3. **Select "🔄 Restart Service"**
4. Service restarts with new configuration

### Quick Access to Status

1. **Click status bar** anytime
2. **Select "ℹ Show Status"**
3. Output channel opens with:
   - Current status (running/stopped)
   - Port information
   - Configuration summary
   - Available endpoints

### Quick Settings Access

1. **Click status bar**
2. **Select "⚙ Open Settings"**
3. VSCode settings open filtered to "oai2ollama"
4. Modify any configuration option

## Keyboard Shortcuts

While there are no default keyboard shortcuts for the status bar, you can create custom shortcuts:

```json
{
  "key": "ctrl+alt+o s",
  "command": "oai2ollama.statusBarClick",
  "when": "true"
}
```

Or directly bind to actions:

```json
{
  "key": "ctrl+alt+o s",
  "command": "oai2ollama.start"
},
{
  "key": "ctrl+alt+o x",
  "command": "oai2ollama.stop"
},
{
  "key": "ctrl+alt+o r",
  "command": "oai2ollama.restart"
}
```

## Comparison: Command Palette vs Status Bar

### Command Palette Method
1. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Type "Oai2Ollama"
3. Select command from list
4. Press Enter

**Steps**: 4
**Time**: ~5 seconds

### Status Bar Method
1. Click status bar item
2. Select action

**Steps**: 2
**Time**: ~2 seconds

**Result**: 60% faster! ⚡

## Tips

💡 **Single-Click Access** - No need to open command palette

💡 **Context-Aware** - Only shows relevant actions for current state

💡 **Visual Feedback** - Clear indication of service status at all times

💡 **Quick Settings** - Jump directly to configuration

💡 **Always Visible** - Status bar is always accessible

## Troubleshooting

### Status Bar Not Visible

1. Check if status bar is hidden: View → Appearance → Show Status Bar
2. Look for the status bar in the bottom-right corner
3. If still not visible, try reloading VSCode window

### Menu Not Opening

1. Ensure you're clicking the text, not just hovering
2. Check output channel for errors
3. Try restarting VSCode

### Actions Not Working

1. Check output channel (View → Output → Oai2Ollama)
2. Verify configuration is correct
3. Check for error messages in notifications

## Technical Details

### Implementation

The status bar functionality is implemented in:
- **[statusBar.ts](src/statusBar.ts)** - Status bar manager and click handler
- **[extension.ts](src/extension.ts)** - Command registration

### Click Handler

```typescript
public async handleClick(): Promise<void> {
    // Determine current state
    const isRunning = this.service.isRunning();

    // Build context-aware menu items
    const items: vscode.QuickPickItem[] = [];

    // Show quick pick menu
    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: isRunning ? 'Service Running' : 'Service Stopped',
        title: 'Oai2Ollama Control Panel'
    });

    // Execute selected action
    await vscode.commands.executeCommand(selectedCommand);
}
```

### State Management

- Service state tracked by `Oai2OllamaService`
- Status bar listens to `onStatusChange` event
- Updates UI automatically on state changes

## Related Documentation

- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
- [PROJECT.md](PROJECT.md) - Technical architecture

---

**The status bar provides the fastest way to control your Oai2Ollama service! 🚀**
