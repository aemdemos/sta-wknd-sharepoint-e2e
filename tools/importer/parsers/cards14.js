/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for the image-list structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // Find the image (first cell)
    let imageEl = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the actual image inside the link
      imageEl = imageLink.querySelector('img');
    }

    // Find the text content (second cell)
    const textContent = document.createElement('div');
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        // If the title is linked, wrap the heading in a link
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.textContent = titleSpan.textContent;
        h3.appendChild(link);
        textContent.appendChild(h3);
      }
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textContent.appendChild(p);
    }
    // Optionally, add CTA if present (not in this HTML, but for resilience)
    // (No explicit CTA in this structure)

    // Compose the row
    rows.push([
      imageEl,
      textContent.childNodes.length ? textContent : ''
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
