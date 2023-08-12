import { debounce, Plugin } from 'obsidian';
import { AnimationSourceType, DEFAULT_SETTINGS, GraniteSettings, GraniteSettingsTab } from './Setting';
import { Granite } from './Granite';

export default class GranitePlugin extends Plugin {
	settings: GraniteSettings;
	granite: Granite;

	async onload() {
		console.log('granite | load');

		await this.loadSettings();

		this.granite = new Granite(this);

		this.addCommand({
			id: 'show',
			name: 'Show Granite',
			callback: () => {
				this.granite.appear();
			},
		});

		this.addCommand({
			id: 'hide',
			name: 'Hide Granite',
			callback: () => {
				this.granite.disappear();
			},
		});

		this.addCommand({
			id: 'enter-writing-mode',
			name: 'Enter writing mode',
			callback: () => {
				this.granite.enterWritingMode();
			},
		});

		this.addCommand({
			id: 'leave-writing-mode',
			name: 'Leave writing mode',
			callback: () => {
				this.granite.leaveWritingMode();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new GraniteSettingsTab(this.app, this));

		// debounce editor-change event on workspace
		this.registerEvent(
			this.app.workspace.on(
				'editor-change',
				debounce(() => {
					this.granite.onEditorChange();
				}, 500),
			),
		);

		this.app.workspace.onLayoutReady(() => this.granite.appear());
	}

	onunload() {
		console.log('granite | unload');

		this.granite.disappear();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		// migrations
		// @ts-ignore
		if (this.settings.animationSource === 'dragon') {
			this.settings.animationSource = AnimationSourceType.DRAKE;
		}
		// @ts-ignore
		if (this.settings.animationSource === 'original') {
			this.settings.animationSource = AnimationSourceType.GEMMY;
		}

		await this.saveSettings();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
