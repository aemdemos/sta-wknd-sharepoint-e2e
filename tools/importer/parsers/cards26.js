/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row EXACTLY as specified
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Get all card items (li)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li');

  items.forEach(item => {
    // --- IMAGE CELL ---
    let imageEl = null;
    const imageDiv = item.querySelector('.cmp-image-list__item-image');
    if (imageDiv) {
      imageEl = imageDiv.querySelector('img'); // reference img directly
    }

    // --- TEXT CELL ---
    const textCell = [];
    // Title: Use strong for semantic meaning (example uses bold)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textCell.push(strong);
      }
    }
    // Description: If present, add below title
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      // Use a <br> only if there is a title above
      if (textCell.length > 0) {
        textCell.push(document.createElement('br'));
      }
      textCell.push(document.createTextNode(descSpan.textContent.trim()));
    }

    // Add the row for this card
    cells.push([
      imageEl,
      textCell
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
