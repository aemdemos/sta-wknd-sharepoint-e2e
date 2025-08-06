/* global WebImporter */
export default function parse(element, { document }) {
  // Check for the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  // Prepare header row exactly as specified
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  items.forEach((li) => {
    // First column: Image
    let image = null;
    const img = li.querySelector('img');
    if (img) {
      image = img;
    }

    // Second column: Title (heading), Description (paragraph)
    const col2 = document.createElement('div');
    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for heading style, reference span if possible
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        col2.appendChild(strong);
        col2.appendChild(document.createElement('br'));
      }
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      col2.appendChild(p);
    }

    rows.push([
      image,
      col2
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
