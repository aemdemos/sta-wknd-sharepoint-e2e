/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment with the surf cards
  const cf = element.querySelector('article.cmp-contentfragment');
  if (!cf) return;
  const mainEl = cf.querySelector('.cmp-contentfragment__elements');
  if (!mainEl) return;

  // Cards array: each row is [image, text]
  const cards = [];
  // Find all top-level h2s in .cmp-contentfragment__elements (each card starts with h2)
  const children = Array.from(mainEl.children);
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.tagName === 'H2') {
      const title = node;
      let img = null;
      let desc = null;
      // Search forward for image and description <p> until next h2 or end
      for (let j = i + 1; j < children.length && children[j].tagName !== 'H2'; j++) {
        const c = children[j];
        if (!img && c.querySelector) {
          const foundImg = c.querySelector('img');
          if (foundImg) img = foundImg;
        }
        if (!desc && c.tagName === 'P') {
          desc = c;
        }
      }
      // Compose text cell: <strong>title</strong><br>[description]
      const textCell = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.appendChild(strong);
      if (desc) {
        textCell.appendChild(document.createElement('br'));
        textCell.appendChild(desc);
      }
      cards.push([
        img || '',
        textCell
      ]);
    }
  }
  if (!cards.length) return;
  const tableRows = [
    ['Cards (cards34)'],
    ...cards
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  cf.replaceWith(block);
}
