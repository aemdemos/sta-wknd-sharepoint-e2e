/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract image element for row 2
  let imageEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // 2. Extract content for row 3 (all children of .cmp-teaser__content)
  let contentNodes = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Only keep element or non-empty text nodes
    contentNodes = Array.from(contentDiv.childNodes).filter(node => {
      if (node.nodeType === 1) return true;
      if (node.nodeType === 3) return node.textContent.trim().length > 0;
      return false;
    });
  }

  // 3. Compose table per the example
  //    Row 1: ["Hero"] (no bold or markdown)
  //    Row 2: [image] (image element or empty string)
  //    Row 3: [all content nodes] (preserve order in one cell)
  const cells = [
    ['Hero'],
    [imageEl || ''],
    [contentNodes.length > 0 ? contentNodes : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
