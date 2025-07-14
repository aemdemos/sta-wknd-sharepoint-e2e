/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [['Cards (cards24)']];
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const children = Array.from(grid.children);

  // We need to preserve the natural order, so intro text and cards appear in the right place
  children.forEach(child => {
    // Handle section titles and descriptive text blocks as single cell rows
    const introBits = [];
    // Any h1/h2 title directly inside this child
    const h1 = child.querySelector('h1.cmp-title__text');
    const h2 = child.querySelector('h2.cmp-title__text');
    if (h1) introBits.push(h1);
    if (h2) introBits.push(h2);
    // Any paragraph text
    const text = child.querySelector('.cmp-text');
    if (text) introBits.push(text);
    if (introBits.length > 0) {
      // If just one, use it directly; if more, use as array
      cells.push([introBits.length === 1 ? introBits[0] : introBits]);
      return;
    }
    // Handle card sections
    if (child.matches('section.experiencefragment')) {
      const img = child.querySelector('img.cmp-image__image');
      const rightContent = [];
      const name = child.querySelector('h3.cmp-title__text');
      if (name) rightContent.push(name);
      const subtitle = child.querySelector('h5.cmp-title__text');
      if (subtitle) rightContent.push(subtitle);
      // Social link buttons
      const buttons = Array.from(child.querySelectorAll('.cmp-button'));
      if (buttons.length) {
        const btnDiv = document.createElement('div');
        buttons.forEach(btn => btnDiv.appendChild(btn));
        rightContent.push(btnDiv);
      }
      if (img && rightContent.length) {
        cells.push([img, rightContent]);
      }
    }
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
