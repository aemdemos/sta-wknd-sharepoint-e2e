/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const cells = [['Cards (cards24)']];

  // Find all card sections
  const cardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Gather all .cmp-text/.text blocks that are direct children of the parent grid
  const allBlocks = Array.from(element.children);

  // Build a map: card section -> its immediately following .cmp-text/.text (if present)
  const cardDescMap = new Map();
  for (let i = 0; i < allBlocks.length; i++) {
    const el = allBlocks[i];
    if (el.matches && el.matches('section.cmp-experience-fragment--contributor')) {
      let desc = null;
      let j = i + 1;
      while (j < allBlocks.length) {
        const sib = allBlocks[j];
        if (sib.matches && sib.matches('.cmp-text, .text')) {
          desc = sib;
          break;
        }
        // Stop search if we find another card section or a title separator
        if (sib.matches && sib.matches('section.cmp-experience-fragment--contributor, .cmp-title')) break;
        j++;
      }
      cardDescMap.set(el, desc);
    }
  }

  cardSections.forEach(section => {
    // First column: the image
    const img = section.querySelector('img.cmp-image__image');

    // Second column: text content (array of elements/text nodes)
    const textEls = [];
    // Add h3 (name/title)
    const h3 = section.querySelector('h3');
    if (h3) textEls.push(h3);
    // Add h5 (role/desc)
    const h5 = section.querySelector('h5');
    if (h5) textEls.push(h5);
    // Add descriptive <p> or other elements from the mapped .cmp-text/.text block
    const descBlock = cardDescMap.get(section);
    if (descBlock) {
      Array.from(descBlock.childNodes).forEach(node => {
        // Only add elements (like <p>, <i>) or non-empty text nodes
        if (node.nodeType === 1) textEls.push(node);
        else if (node.nodeType === 3 && node.textContent.trim()) textEls.push(document.createTextNode(node.textContent));
      });
    }
    // Add all button links (social buttons)
    const btns = Array.from(section.querySelectorAll('a.cmp-button'));
    if (btns.length) {
      textEls.push(document.createElement('br'));
      btns.forEach((btn, i) => {
        if (i > 0) textEls.push(document.createTextNode(' '));
        textEls.push(btn);
      });
    }
    cells.push([img, textEls]);
  });

  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
