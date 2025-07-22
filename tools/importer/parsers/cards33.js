/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content fragment section
  const mainArticle = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!mainArticle) return;
  const elementsContainer = mainArticle.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;
  const children = Array.from(elementsContainer.childNodes);
  // Find all h2 nodes (each surf spot)
  let cardStartIndexes = [];
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.nodeType === 1 && node.tagName.toLowerCase() === 'h2') {
      cardStartIndexes.push(i);
    }
  }
  // Prepare each card: image (before/after h2), h2 as title, then all content until next h2
  const cards = [];
  for (let c = 0; c < cardStartIndexes.length; c++) {
    const startIdx = cardStartIndexes[c];
    const endIdx = (c+1 < cardStartIndexes.length) ? cardStartIndexes[c+1] : children.length;
    // Look for .cmp-image element before h2
    let image = '';
    for (let i = startIdx-1; i >= 0; i--) {
      const node = children[i];
      if (node.nodeType === 1 && node.querySelector) {
        const img = node.querySelector('.cmp-image');
        if (img) {
          image = img;
          break;
        }
      }
      if (node.nodeType === 1 && node.tagName.toLowerCase() === 'h2') break;
    }
    // If not found, try after h2 within card content
    if (!image) {
      for (let i = startIdx+1; i < endIdx; i++) {
        const node = children[i];
        if (node.nodeType === 1 && node.querySelector) {
          const img = node.querySelector('.cmp-image');
          if (img) {
            image = img;
            break;
          }
        }
      }
    }
    // The h2 node for the heading
    const titleNode = children[startIdx];
    // Collect text content nodes for this card
    const textContent = [];
    // Title in <strong>
    if (titleNode && titleNode.textContent) {
      const strong = document.createElement('strong');
      strong.textContent = titleNode.textContent;
      textContent.push(strong);
    }
    // All <p> and <div> (and text) between h2 and next h2
    for (let i = startIdx + 1; i < endIdx; i++) {
      const node = children[i];
      // Paragraphs and divs with text
      if (node.nodeType === 1 && (node.tagName.toLowerCase() === 'p' || node.tagName.toLowerCase() === 'div')) {
        // Don't include empty <div>
        if (node.textContent && node.textContent.trim() !== '') {
          textContent.push(document.createElement('br'));
          textContent.push(node);
        }
      }
    }
    // Remove leading <br> if added
    if (textContent.length > 1 && textContent[1].tagName && textContent[1].tagName.toLowerCase() === 'br') {
      textContent.splice(1, 1);
    }
    cards.push([
      image || '',
      textContent
    ]);
  }
  // Table structure: header row, then one card per row
  const tableCells = [
    ['Cards (cards33)'],
    ...cards
  ];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  // Replace the original element with the new table block
  element.replaceWith(block);
}
