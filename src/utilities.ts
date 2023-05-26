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
