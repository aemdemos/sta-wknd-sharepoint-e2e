/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <article class="contentfragment">, which holds the surf spots info
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;
  // Find the main content block that holds all the card content
  let mainContentDiv = null;
  const contentElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (contentElements) {
    // Find the div with most children (not just empty wrappers)
    const divs = Array.from(contentElements.children);
    // Use the first non-empty div, or fallback to contentElements
    mainContentDiv = divs.find(d => d.children.length || d.childNodes.length) || contentElements;
  } else {
    mainContentDiv = contentFragment;
  }
  // Get all nodes in order (h2, images, paragraphs)
  const nodes = Array.from(mainContentDiv.childNodes).filter(n => n.nodeType === 1 || n.nodeType === 3);
  // Build cards by traversing h2, then gathering images and paras until next h2
  const cards = [];
  let current = 0;
  while (current < nodes.length) {
    // Find h2
    while (current < nodes.length && !(nodes[current].nodeType === 1 && nodes[current].tagName && nodes[current].tagName.toLowerCase() === 'h2')) {
      current++;
    }
    if (current >= nodes.length) break;
    const h2 = nodes[current];
    current++;
    // Collect all following images and paragraphs until next h2
    let image = '';
    const textParts = [];
    while (current < nodes.length && !(nodes[current].nodeType === 1 && nodes[current].tagName && nodes[current].tagName.toLowerCase() === 'h2')) {
      const node = nodes[current];
      if (node.nodeType === 1) {
        // image block
        const imgEl = node.querySelector && node.querySelector('div[data-cmp-is="image"]');
        if (imgEl && !image) image = imgEl;
        // paragraph
        if (node.tagName.toLowerCase() === 'p') {
          textParts.push(node);
        }
      }
      current++;
    }
    // Title in bold
    const strong = document.createElement('strong');
    strong.textContent = h2.textContent;
    // Assemble text cell: title (bold) + (br) + all paragraphs
    const cardCell = [strong];
    if (textParts.length) {
      cardCell.push(document.createElement('br'));
      textParts.forEach((p, idx) => {
        if (idx > 0) cardCell.push(document.createElement('br'));
        cardCell.push(p);
      });
    }
    cards.push([image || '', cardCell]);
  }
  if (!cards.length) return;
  // Compose the table
  const rows = [
    ['Cards (cards16)'],
    ...cards,
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
