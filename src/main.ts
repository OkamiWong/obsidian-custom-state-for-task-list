import { Plugin } from 'obsidian'
import { Emoji } from './emoji'

function getTextNodes(e: HTMLElement): Array<ChildNode> {
  const textNodes = []
  const childNodes = e.childNodes
  for (let i = 0; i < childNodes.length; i++) {
    const childNode = childNodes.item(i)
    if (childNode.nodeType === Node.TEXT_NODE) {
      textNodes.push(childNode)
    }
  }
  return textNodes
}

function getTopTextContent(e: HTMLLIElement): string {
  const topTextContents = []
  for(const textNode of getTextNodes(e)){
    if(textNode.nodeValue !== null){
      topTextContents.push(textNode.nodeValue)
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
        const isListItem = firstChild !== null && firstChild.outerHTML.startsWith('<div class="list-bullet">')

        const taskContent = getTopTextContent(e).trimEnd()
        const taskStates = taskContent.match(customStateRegex)

        if (isListItem && taskStates?.length === 1) {
          // taskContent: {taskState} {taskDescription} 
          const taskState = taskStates[0]
          const taskDescription = taskContent.substring(taskState.length).trim()
          console.log('Custom Task Found "%s" : %o', taskContent, domParser.parseFromString(e.innerHTML, 'text/html').body)

          context.addChild(new Emoji(e, firstChild as HTMLElement, getTextNodes(e)[0], taskState, taskDescription))
        }
      }
    })
  }
}
