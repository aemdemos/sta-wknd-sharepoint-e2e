/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Cards (cards21)'];

  // Find the image list
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;

  // Get all cards
  const rows = Array.from(list.children).filter(li => li.matches('.cmp-image-list__item')).map(li => {
    // Image: first <img> inside the card
    let img = li.querySelector('img');
    // Text: Compose from existing elements (title and description)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descSpan = li.querySelector('.cmp-image-list__item-description');

    // Compose card text cell
    // Use a fragment to reference original elements and preserve semantics
    const textCell = document.createElement('div');
    if (titleSpan) {
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      textCell.appendChild(heading);
    }
    if (descSpan) {
      // Use block semantics for description
      const desc = document.createElement('p');
      desc.textContent = descSpan.textContent;
      textCell.appendChild(desc);
    }
    return [img, textCell];
  });

  // Build table and replace
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
