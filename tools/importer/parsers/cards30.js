/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards30) block: 2 columns, header is 'Cards (cards30)'
  const headerRow = ['Cards (cards30)'];

  // Find all card list items
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  
  const rows = [];
  cardItems.forEach((li) => {
    // --- Image cell ---
    let imageCell = null;
    const imgLink = li.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      const img = imgLink.querySelector('img');
      if (img) imageCell = img;
    }
    // --- Text cell ---
    const textCellContent = [];
    // Title: strong (for bold, matching heading-style), with link
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const strong = document.createElement('strong');
      const a = titleLink; // Use the existing <a> element directly
      // Remove child nodes except the <span> title (if present)
      const span = a.querySelector('span.cmp-image-list__item-title');
      if (span) {
        // Remove all children, then append span
        while(a.firstChild) a.removeChild(a.firstChild);
        a.appendChild(span);
      }
      strong.appendChild(a);
      textCellContent.push(strong);
    }
    // Description (below heading)
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Use the existing <span> element for description
      textCellContent.push(desc);
    }
    rows.push([imageCell, textCellContent]);
  });

  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
