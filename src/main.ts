import { Plugin } from 'obsidian'
import { Emoji } from './emoji'

function getTopTextContent(e: HTMLLIElement): string {
  const topTextContents = []
  const childNodes = e.childNodes
  for (let i = 0; i < childNodes.length; i++) {
    const childNode = childNodes.item(i)
    if (childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue !== null) {
      topTextContents.push(childNode.nodeValue)
    }
  }
  return topTextContents.join('')
}

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor((element, context) => {
      const domParser = new DOMParser()
      const customStateRegex = /^\[\w+\](?=\s)/
      const elements = element.querySelectorAll('li')

      for (let i = 0; i < elements.length; i++) {
        const e = elements.item(i)
        const children = e.children

        const firstChild = children.item(0)
        const isListBullet = firstChild !== null && firstChild.outerHTML.startsWith('<div class="list-bullet">')

        const taskDescription = getTopTextContent(e).trimEnd()
        const taskStates = taskDescription.match(customStateRegex)
        const isCustomTask =
          isListBullet
          && taskStates?.length === 1

        if (isCustomTask) {
          console.log('Custom Task Found "%s" : %o', taskDescription, domParser.parseFromString(e.innerHTML, 'text/html').body)

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          context.addChild(new Emoji(e, taskStates[0], taskDescription))
        }
      }
    })
  }
}
