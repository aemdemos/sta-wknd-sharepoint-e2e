/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Defensive: find all immediate li children representing cards
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((li) => {
    // Find image (mandatory)
    const img = li.querySelector('img');
    let imgCell = img;
    // Defensive: ensure we reference the existing element
    // (no cloning or creating new images)

    // Find text content
    const titleSpan = li.querySelector('span.cmp-image-list__item-title');
    const descSpan = li.querySelector('span.cmp-image-list__item-description');

    // Create text cell content
    const textCell = document.createElement('div');
    if (titleSpan) {
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      textCell.appendChild(heading);
    }
    if (descSpan) {
      const desc = document.createElement('div');
      desc.textContent = descSpan.textContent;
      textCell.appendChild(desc);
    }
    // No CTA in this HTML, but logic could be added here if needed

    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
