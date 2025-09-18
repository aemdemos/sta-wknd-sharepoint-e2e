/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate on the image-list block
  if (!element.classList.contains('image-list')) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Find all card items (li elements)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  // If no items found, do nothing
  if (!items.length) return;

  items.forEach((li) => {
    // First cell: image (use the .cmp-image element, not just <img>)
    let imageCell = null;
    const cmpImage = li.querySelector('.cmp-image-list__item-image .cmp-image');
    if (cmpImage) {
      imageCell = cmpImage.cloneNode(true);
    } else {
      // fallback: just the image
      const img = li.querySelector('img');
      if (img) imageCell = img.cloneNode(true);
    }

    // Second cell: text content (title as heading, then description)
    const textCell = document.createElement('div');
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const heading = document.createElement('h3');
      const link = titleLink.cloneNode(true);
      heading.appendChild(link);
      textCell.appendChild(heading);
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      textCell.appendChild(desc.cloneNode(true));
    }
    // (No CTA in this block, but if present, include it)
    const cta = li.querySelector('.cmp-image-list__item-cta');
    if (cta) {
      textCell.appendChild(cta.cloneNode(true));
    }

    rows.push([
      imageCell,
      textCell.childNodes.length ? textCell : document.createTextNode('')
    ]);
  });

  // Create block table and replace element
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
