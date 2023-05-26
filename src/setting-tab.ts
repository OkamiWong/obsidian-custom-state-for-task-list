import { PluginSettingTab, App, Setting } from 'obsidian'
import CustomStateTaskPlugin from './main'

export interface CustomState {
  state: string
  readingView: string
}

export interface CustomTaskStatePluginSettings {
  customStates: Array<CustomState>
}

export const DEFAULT_SETTINGS: CustomTaskStatePluginSettings = {
  customStates: [
    { state: 'committed', readingView: '📌' },
    { state: 'doing', readingView: '🚧' },
    { state: 'deferred', readingView: '😴' },
    { state: 'removed', readingView: '🗑' }
  ]
}

const DEFAULT_NEW_CUSTOM_STATE: CustomState = {
  state: 'newState',
  readingView: '🆕'
}

export class CustomTaskStatePluginSettingTab extends PluginSettingTab {
  plugin: CustomStateTaskPlugin

  constructor(app: App, plugin: CustomStateTaskPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  async commitChanges(): Promise<void> {
    await this.plugin.saveSettings()
    this.display()
  }

  async commitChangesWithoutRerendering(): Promise<void> {
    await this.plugin.saveSettings()
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()

    containerEl.createEl('h1', { text: 'Custom State for Task List' })

    containerEl
      .createEl('p', { text: 'Introduction and usage: ' })
      .createEl('a', {
        text: 'README.md',
        href: 'https://github.com/OkamiWong/obsidian-custom-state-for-task-list#readme'
      })

    containerEl
      .createEl('p', { text: 'Developer: ' })
      .createEl('a', {
        text: 'Okami Wong',
        href: 'https://github.com/OkamiWong'
      })

    new Setting(containerEl)
      .setName('Reset custom states')
      .setDesc('Warning: this will roll back to the default settings and cause you to lose all the changes.')
      .addButton(button => button
        .setButtonText('Reset')
        .onClick(async () => {
          this.plugin.settings = structuredClone(DEFAULT_SETTINGS)
          await this.commitChanges()
        }))

    new Setting(containerEl)
      .setName('Add custom state')
      .setDesc('Click the button on the right side to add more custom state.')
      .addButton(button => {
        button
          .setButtonText('Add')
          .onClick(async () => {
            this.plugin.settings.customStates.push(structuredClone(DEFAULT_NEW_CUSTOM_STATE))
            await this.commitChanges()
          })
      })

    for (let i = 0; i < this.plugin.settings.customStates.length; i++) {
      const customState = this.plugin.settings.customStates[i]
      new Setting(containerEl)
        .setName(`Custom State ${i + 1}`)
        .addText(text => text
          .setPlaceholder('Name of the state')
          .setValue(customState.state)
          .onChange(async (value) => {
            this.plugin.settings.customStates[i].state = value
            await this.commitChangesWithoutRerendering()
          }))
        .addText(text => text
          .setPlaceholder('String to display in reading view')
          .setValue(customState.readingView)
          .onChange(async (value) => {
            this.plugin.settings.customStates[i].readingView = value
            await this.commitChangesWithoutRerendering()
          }))
        .addButton(button => button
          .setButtonText('Remove')
          .onClick(async () => {
            this.plugin.settings.customStates.remove(customState)
            await this.commitChanges()
          }))
    }
  }
}
