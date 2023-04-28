import { Plugin } from 'obsidian'
import { Emoji } from './emoji'

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor((element, context) => {
      const elements = element.querySelectorAll('li')

      for (let i = 0; i < elements.length; i++) {
        const e = elements.item(i)
        const domParser = new DOMParser()
        console.log('%o', domParser.parseFromString(e.innerHTML, 'text/html').body)

        const children = e.children
        const isListBullet = children.item(0)?.outerHTML.startsWith('<div class="list-bullet">')
        const isCustomTask =
					isListBullet
					&& e.textContent !== null
					&& e.textContent.startsWith('[')
        if (isCustomTask)
          console.log('Custom Task Found: %o', domParser.parseFromString(e.innerHTML, 'text/html').body)
      }

      // for (let index = 0; index < elements.length; index++) {
      // 	const codeblock = elements.item(index);
      // 	const text = codeblock.innerText.trim();
      // 	const isEmoji = text[0] === ":" && text[text.length - 1] === ":";

      // 	if (isEmoji) {
      // 		context.addChild(new Emoji(codeblock, text));
      // 		//
      // 	}
      // }
    })
  }
}
