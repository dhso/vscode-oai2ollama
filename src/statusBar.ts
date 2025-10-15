import * as vscode from 'vscode';
import { Oai2OllamaService } from './service';

export class StatusBarManager implements vscode.Disposable {
    private statusBarItem: vscode.StatusBarItem;

    constructor(private service: Oai2OllamaService) {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );

        this.statusBarItem.command = 'oai2ollama.statusBarClick';
        this.update();
        this.statusBarItem.show();

        // Listen for service status changes
        this.service.onStatusChange(() => {
            this.update();
        });
    }

    public async handleClick(): Promise<void> {
        const isRunning = this.service.isRunning();
        const config = vscode.workspace.getConfiguration('oai2ollama');
        const port = config.get<number>('port', 11434);
        const host = config.get<string>('host', 'localhost');

        // Create quick pick items based on current status
        const items: vscode.QuickPickItem[] = [];

        if (isRunning) {
            items.push(
                {
                    label: '$(debug-stop) Stop Service',
                    description: `Currently running on ${host}:${port}`,
                    detail: 'Stop the Oai2Ollama service'
                },
                {
                    label: '$(debug-restart) Restart Service',
                    description: 'Restart with current configuration',
                    detail: 'Stop and start the service again'
                },
                {
                    label: '$(info) Show Status',
                    description: 'View detailed status information',
                    detail: 'Open output channel with full status'
                },
                {
                    label: '$(gear) Open Settings',
                    description: 'Configure Oai2Ollama',
                    detail: 'Open extension settings'
                }
            );
        } else {
            items.push(
                {
                    label: '$(play) Start Service',
                    description: `Will start on ${host}:${port}`,
                    detail: 'Start the Oai2Ollama service'
                },
                {
                    label: '$(info) Show Status',
                    description: 'View detailed status information',
                    detail: 'Open output channel with full status'
                },
                {
                    label: '$(gear) Open Settings',
                    description: 'Configure Oai2Ollama',
                    detail: 'Open extension settings'
                }
            );
        }

        // Show quick pick
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: isRunning
                ? 'Oai2Ollama Service is Running'
                : 'Oai2Ollama Service is Stopped',
            title: 'Oai2Ollama Control Panel'
        });

        if (!selected) {
            return;
        }

        // Handle selection
        if (selected.label.includes('Start')) {
            await vscode.commands.executeCommand('oai2ollama.start');
        } else if (selected.label.includes('Stop')) {
            await vscode.commands.executeCommand('oai2ollama.stop');
        } else if (selected.label.includes('Restart')) {
            await vscode.commands.executeCommand('oai2ollama.restart');
        } else if (selected.label.includes('Status')) {
            await vscode.commands.executeCommand('oai2ollama.showStatus');
        } else if (selected.label.includes('Settings')) {
            await vscode.commands.executeCommand('oai2ollama.openSettings');
        }
    }

    public update(): void {
        const config = vscode.workspace.getConfiguration('oai2ollama');
        const port = config.get<number>('port', 11434);

        if (this.service.isRunning()) {
            this.statusBarItem.text = `$(check) Oai2Ollama :${port}`;
            this.statusBarItem.tooltip = 'Oai2Ollama service is running\nClick for quick actions';
            this.statusBarItem.backgroundColor = undefined;
        } else {
            this.statusBarItem.text = `$(circle-slash) Oai2Ollama`;
            this.statusBarItem.tooltip = 'Oai2Ollama service is stopped\nClick for quick actions';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
    }

    public dispose(): void {
        this.statusBarItem.dispose();
    }
}
