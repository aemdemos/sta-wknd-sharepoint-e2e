/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Each card is an <li class="cmp-image-list__item">
  const cardListItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardListItems.forEach((li) => {
    // Image
    const img = li.querySelector('.cmp-image-list__item-image img');

    // Title as <strong>
    let titleNode = '';
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        titleNode = strong;
      }
    }

    // Description as plain text
    let descText = '';
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      descText = descSpan.textContent.trim();
    }

    // Build the right column, title in <strong> on top, then description below
    let textCell;
    if (titleNode && descText) {
      textCell = [titleNode, document.createElement('br'), descText];
    } else if (titleNode) {
      textCell = titleNode;
    } else if (descText) {
      textCell = descText;
    } else {
      textCell = '';
    }

    // Push row to table
    cells.push([
      img,
      textCell
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
