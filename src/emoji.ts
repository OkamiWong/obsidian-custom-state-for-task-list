import { MarkdownRenderChild } from 'obsidian'

export class Emoji extends MarkdownRenderChild {
  static ALL_EMOJIS: Record<string, string> = {
    '[doing]': '🚧'
  }

  bulletNode: HTMLElement
  textNode: Node
  state: string
  description: string

  constructor(
    containerEl: HTMLElement,
    bulletNode: HTMLElement,
    textNode: Node,
    state: string,
    description: string
  ) {
    super(containerEl)
    this.bulletNode = bulletNode
    this.textNode = textNode
    this.state = state
    this.description = description
  }

  onload() {
    const emojiEl = this.containerEl.createSpan({
      cls: 'task-list-item-checkbox',
      text: Emoji.ALL_EMOJIS[this.state]
    })
    this.containerEl.classList.add('task-list-item')
    this.bulletNode.replaceWith(emojiEl)
    this.textNode.nodeValue = this.description
  }
}
