/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required by block spec
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Defensive: find the image list container
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Get all cards (li elements)
  const items = imageList.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((li) => {
    // Find image element
    let img = li.querySelector('img');
    // Defensive: skip if no image
    if (!img) return;

    // Find title link and title span
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    // Find description span
    const descSpan = li.querySelector('span.cmp-image-list__item-description');

    // Build text cell
    const textCell = [];
    if (titleSpan) {
      // Create heading element for title
      const titleEl = document.createElement('h3');
      titleEl.textContent = titleSpan.textContent;
      textCell.push(titleEl);
    }
    if (descSpan) {
      // Add description below title
      const descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
      textCell.push(descEl);
    }
    // Optionally, add CTA if present (not in this HTML, but code supports it)
    // If titleLink exists and is not just the title, add as CTA (skip for now)

    // Compose row: image in first cell, text in second cell
    rows.push([img, textCell]);
  });

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
