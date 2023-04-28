import { MarkdownRenderChild } from 'obsidian'

export class Emoji extends MarkdownRenderChild {
  static ALL_EMOJIS: Record<string, string> = {
    '[doing]': '🚧'
  }

  state: string
  description: string

  constructor(containerEl: HTMLElement, state: string, description: string) {
    super(containerEl)
    this.state = state
    this.description = description
  }

  onload() {
    const emojiEl = this.containerEl.createSpan({
      text: Emoji.ALL_EMOJIS[this.state] + this.description
    })
    this.containerEl.replaceWith(emojiEl)
  }
}
