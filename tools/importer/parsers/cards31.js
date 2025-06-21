/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row as per requirements
  const cells = [['Cards (cards31)']];

  // Get all card items
  const items = element.querySelectorAll('.cmp-image-list__item');

  items.forEach((item) => {
    // Get the image (first <img> descendant)
    const img = item.querySelector('img');
    const imageCell = img || '';

    // Title (should be bold/strong)
    let titleNode = '';
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for the title, not <h2> etc as example is bold text
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        titleNode = strong;
      }
    }

    // Description
    let descNode = '';
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Place description in its own <div> (to stack under title)
      descNode = document.createElement('div');
      descNode.textContent = descSpan.textContent.trim();
    }

    // Compose the text cell
    const textCell = [];
    if (titleNode) textCell.push(titleNode);
    if (descNode) textCell.push(descNode);

    cells.push([imageCell, textCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
