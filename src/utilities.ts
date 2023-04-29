export function getTextNodes(e: HTMLElement): Array<ChildNode> {
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

export function getTopTextContent(e: HTMLLIElement): string {
  const topTextContents = []
  for (const textNode of getTextNodes(e)) {
    if (textNode.nodeValue !== null) {
      topTextContents.push(textNode.nodeValue)
    }
  }
  return topTextContents.join('')
}
