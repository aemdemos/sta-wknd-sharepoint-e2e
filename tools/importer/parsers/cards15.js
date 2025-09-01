/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment block
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;
  const elementsSection = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsSection) return;

  // Prepare the block table
  const rows = [];
  rows.push(['Cards (cards15)']); // Header must match the example exactly

  // Collect all children, including text nodes
  const children = Array.from(elementsSection.childNodes);
  let i = 0;
  // Move to the first h2 (skip intro)
  while (i < children.length && !(children[i].nodeType === 1 && children[i].tagName && children[i].tagName.toLowerCase() === 'h2')) {
    i++;
  }

  // For each card: look for pattern h2, optional image (div with image), p
  while (i < children.length) {
    // 1. Title (h2)
    let h2 = null;
    while (i < children.length && !(children[i].nodeType === 1 && children[i].tagName && children[i].tagName.toLowerCase() === 'h2')) i++;
    if (i >= children.length) break;
    h2 = children[i];
    i++;

    // 2. Optional image (div > div[data-cmp-is="image"])
    let cardImg = null;
    let imgSearchIdx = i;
    // Only look ahead up to the next h2 or p
    while (imgSearchIdx < children.length) {
      const node = children[imgSearchIdx];
      if (node.nodeType === 1 && node.tagName) {
        const tag = node.tagName.toLowerCase();
        if (tag === 'div') {
          const imgEl = node.querySelector('div[data-cmp-is="image"]');
          if (imgEl) {
            cardImg = imgEl;
            imgSearchIdx++;
            break;
          }
        }
        if (tag === 'h2' || tag === 'p') break;
      }
      imgSearchIdx++;
    }
    if (imgSearchIdx > i) i = imgSearchIdx;

    // 3. Description (p)
    let cardP = null;
    while (i < children.length) {
      const node = children[i];
      if (node.nodeType === 1 && node.tagName && node.tagName.toLowerCase() === 'p') {
        cardP = node;
        i++;
        break;
      }
      if (node.nodeType === 1 && node.tagName && node.tagName.toLowerCase() === 'h2') break;
      i++;
    }

    // Compose text cell: <strong> for title, <br>, then all text from <p> (preserving formatting)
    const textCell = [];
    if (h2) {
      const strong = document.createElement('strong');
      strong.textContent = h2.textContent;
      textCell.push(strong);
    }
    if (cardP) {
      textCell.push(document.createElement('br'));
      // Use original childNodes for all formatting and links
      cardP.childNodes.forEach(n => textCell.push(n));
    }
    // Only add if text or image present
    if (cardImg || textCell.length) {
      rows.push([cardImg || '', textCell]);
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
