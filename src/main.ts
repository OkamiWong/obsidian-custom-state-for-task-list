import { MarkdownPostProcessorContext, Plugin } from 'obsidian'
import { TaskView } from './task-view'
import { getTextNodes, getTopTextContent } from './utilities'
import { CustomState, DEFAULT_SETTINGS, CustomTaskStatePluginSettings, CustomTaskStatePluginSettingTab } from './setting-tab'

export default class CustomTaskStatePlugin extends Plugin {
  settings: CustomTaskStatePluginSettings

  async loadSettings() {
    this.settings = Object.assign({}, structuredClone(DEFAULT_SETTINGS), await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)

    // console.log(this.settings)
  }

  async onload() {
    await this.loadSettings()

    this.addSettingTab(new CustomTaskStatePluginSettingTab(this.app, this))


    this.registerMarkdownPostProcessor((element: HTMLElement, context: MarkdownPostProcessorContext) => {
      const domParser = new DOMParser()
      const customStateRegex = /^\[\w+\](?=\s)/
      const elements = element.querySelectorAll('li')

      for (let i = 0; i < elements.length; i++) {
        const e = elements.item(i)
        const children = e.children

        const firstChild = children.item(0)
        const isListItem = firstChild !== null && firstChild.outerHTML.startsWith('<div class="list-bullet">')

        const taskContent = getTopTextContent(e).trimEnd()
        const taskStates = taskContent.match(customStateRegex)

        if (isListItem && taskStates?.length === 1) {
          const taskStateRaw = taskStates[0]
          const taskDescription = taskContent.substring(taskStateRaw.length).trim()

          const taskState = taskStateRaw.substring(1, taskStateRaw.length - 1)
          let matchedCustomState: CustomState | null = null
          for (const customState of this.settings.customStates) {
            if (customState.state === taskState) {
              matchedCustomState = customState
              break
            }
          }
          if (matchedCustomState !== null) {
            // console.log('Custom Task Found "%s" : %o', taskContent, domParser.parseFromString(e.innerHTML, 'text/html').body)
            context.addChild(new TaskView(e, firstChild as HTMLElement, getTextNodes(e)[0], matchedCustomState.readingView, taskDescription))
          }
        }
      }
    })
  }
}
