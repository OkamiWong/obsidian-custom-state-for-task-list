import { MarkdownRenderChild } from 'obsidian'
import { CustomState } from './setting-tab'
import { getTextNodes } from './utilities'

export class TaskView extends MarkdownRenderChild {
  customState: CustomState

  constructor(
    containerEl: HTMLElement,
    customState: CustomState
  ) {
    super(containerEl)
    this.customState = customState
  }

  onload() {
    const stateReadingViewEl = document.body.createSpan({
      cls: 'task-list-item-checkbox',
      text: this.customState.readingView
    })
    this.containerEl.classList.add('task-list-item')

    // When there is an empty line in side a list,
    // Obsidian creates a `p` element as the parent of the content of the list item.
    const p = this.containerEl.querySelector('p')
    const descriptionContainer = p || this.containerEl

    const children = Array.from(descriptionContainer.childNodes)
    descriptionContainer.setChildrenInPlace([stateReadingViewEl, ...children])

    const firstTextNode = getTextNodes(descriptionContainer)[0]
    firstTextNode.nodeValue =
      firstTextNode.nodeValue!.trimStart()
        .substring(this.customState.state.length + 2)
        .trimStart()
  }
}
