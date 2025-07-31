/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards26)'];

  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [];

  items.forEach((item) => {
    // --- First column: image ---
    let img = item.querySelector('.cmp-image-list__item-image img');
    // Use the actual img element from the DOM (do not clone)
    let imageCell = img;

    // --- Second column: text content ---
    // Reference the existing title and description DOM elements
    // Create a container <div> to preserve structure, reference existing DOM nodes
    const textCell = document.createElement('div');

    // Title (use <strong> as in the example, reference text only)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }

    // Description (always below title, if present)
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Reference the original element so styles are preserved
      textCell.appendChild(descSpan);
    }

    rows.push([imageCell, textCell]);
  });

  // Construct the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
