/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards23)'];
  const cells = [headerRow];

  // Find the main grid containing the section structure
  const grid = element.querySelector(':scope > div > div.aem-Grid');
  if (grid) {
    // Go through the children to find all intro paragraphs (cmp-text) and add them as table rows
    const gridChildren = Array.from(grid.children);
    for (let i = 0; i < gridChildren.length; i++) {
      const child = gridChildren[i];
      // Only add rows for small section intro paragraphs (e.g., <div class="text cmp-text--font-small ...">)
      // The intro text is always in a .cmp-text node
      const introEl = child.querySelector('.cmp-text');
      if (introEl) {
        cells.push([introEl]);
      }
    }
  }

  // Now add all the cards as before
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  cardSections.forEach(section => {
    // First column: image
    const img = section.querySelector('.cmp-image img');
    const imgCell = img || '';
    // Second column: text content (title, subtitle, buttons)
    let contentContainer = section.querySelector('.cmp-container .cmp-container .cmp-container');
    if (!contentContainer) {
      contentContainer = section.querySelector('.cmp-container .cmp-container') || section;
    }
    const textParts = [];
    const h3 = contentContainer.querySelector('h3');
    if (h3) textParts.push(h3);
    const h5 = contentContainer.querySelector('h5');
    if (h5) textParts.push(h5);
    const ps = contentContainer.querySelectorAll('p');
    ps.forEach(p => textParts.push(p));
    const buttons = Array.from(contentContainer.querySelectorAll('a.cmp-button'));
    if (buttons.length) {
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn));
      textParts.push(btnDiv);
    }
    if (textParts.length === 0 && section.textContent.trim()) {
      textParts.push(document.createTextNode(section.textContent.trim()));
    }
    const textCell = textParts.length > 1 ? textParts : (textParts[0] || '');
    cells.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
