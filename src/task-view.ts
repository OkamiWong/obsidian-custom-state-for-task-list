import { MarkdownRenderChild } from 'obsidian'

export class TaskView extends MarkdownRenderChild {
  bulletNode: HTMLElement
  textNode: Node
  stateReadingView: string
  description: string

  constructor(
    containerEl: HTMLElement,
    bulletNode: HTMLElement,
    textNode: Node,
    stateReadingView: string,
    description: string
  ) {
    super(containerEl)
    this.bulletNode = bulletNode
    this.textNode = textNode
    this.stateReadingView = stateReadingView
    this.description = description
  }

  onload() {
    const stateReadingViewEl = this.containerEl.createSpan({
      cls: 'task-list-item-checkbox',
      text: this.stateReadingView
    })
    this.containerEl.classList.add('task-list-item')
    this.bulletNode.replaceWith(stateReadingViewEl)
    this.textNode.nodeValue = this.description
  }
}
