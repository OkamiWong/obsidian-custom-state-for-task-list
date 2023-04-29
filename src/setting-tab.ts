import { PluginSettingTab, App, Setting } from 'obsidian'
import MyPlugin from './main'

export interface CustomState {
  state: string
  readingView: string
}

export interface MyPluginSettings {
  customStates: Array<CustomState>
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
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

export class MySettingTab extends PluginSettingTab {
  plugin: MyPlugin

  constructor(app: App, plugin: MyPlugin) {
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

    new Setting(containerEl)
      .setName('Reset custom states')
      .setDesc('Warning: this will roll back to the default settings and cause you to lose all the changes.')
      .addButton(button => button
        .setButtonText('Reset')
        .onClick(async () => {
          this.plugin.settings = DEFAULT_SETTINGS
          await this.commitChanges()
        }))

    new Setting(containerEl)
      .setName('Add custom state')
      .setDesc('Click the button on the right side to add more custom state.')
      .addButton(button => {
        button
          .setButtonText('Add')
          .onClick(async () => {
            this.plugin.settings.customStates.push(DEFAULT_NEW_CUSTOM_STATE)
            await this.commitChanges()
          })
      })

    for (let i = 0; i < this.plugin.settings.customStates.length; i++) {
      const customState = this.plugin.settings.customStates[i]
      new Setting(containerEl)
        .setName(`Custom State ${i + 1}`)
        .setDesc('Set the name of the state and the string to display in the reading view. Emoji is recommended to use in reading view.')
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
