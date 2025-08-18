/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Find all list items (cards)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Get the image element (first img inside the card)
    let imgEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }

    // Get the title and wrap it in <strong> for heading style
    let titleEl = null;
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
    }

    // Get description (can be missing)
    let descEl = null;
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      descEl = descSpan;
    }

    // Build text cell content
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) {
      // Add a break only if both title and description present
      if (titleEl) textCell.push(document.createElement('br'));
      textCell.push(descEl);
    }
    // If both missing, add a blank string to avoid empty cell
    if (textCell.length === 0) textCell.push('');

    // Add card row: [image, text cell]
    cells.push([imgEl, textCell]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
