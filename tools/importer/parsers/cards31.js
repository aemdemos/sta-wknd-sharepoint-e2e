/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];
  // Find the <ul> of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((li) => {
    // First cell: the image element (must reference existing <img> element)
    let imgCell = '';
    const img = li.querySelector('img');
    if (img) {
      imgCell = img;
    }
    // Second cell: text content (title as bold + description)
    const cellFrag = document.createDocumentFragment();
    // Title: bold and optionally as a link if present
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      if (titleLink && titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.appendChild(strong);
        cellFrag.appendChild(a);
      } else {
        cellFrag.appendChild(strong);
      }
      cellFrag.appendChild(document.createElement('br'));
    }
    // Description: as plain text (from span)
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      cellFrag.appendChild(desc);
    }
    rows.push([imgCell, cellFrag]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
