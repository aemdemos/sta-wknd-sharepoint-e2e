/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block/component name
  const headerRow = ['Cards (cards14)'];

  // Find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const cards = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));

  const rows = cards.map((li) => {
    // --- IMAGE CELL ---
    // Get the image element (mandatory, must reference original node)
    const img = li.querySelector('.cmp-image-list__item-image img');
    // If no image, use null for this cell so it renders empty
    const imageCell = img || '';

    // --- TEXT CELL ---
    const textEls = [];
    // Title (mandatory, as heading with link)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use an h3 for title, and put the provided <a> as its child
      const h3 = document.createElement('h3');
      h3.appendChild(titleLink); // reference, do NOT clone
      textEls.push(h3);
    }
    // Description (optional)
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textEls.push(p);
    }
    // If no text at all, provide empty string
    const textCell = textEls.length ? textEls : '';

    return [imageCell, textCell];
  });

  // Compose and render table
  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
