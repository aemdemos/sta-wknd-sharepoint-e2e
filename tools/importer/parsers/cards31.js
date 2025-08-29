/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches block name from instructions
  const headerRow = ['Cards (cards31)'];
  const cells = [headerRow];

  // Find all list items (cards)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  cardItems.forEach((li) => {
    // Image element (first cell)
    let imgEl = li.querySelector('.cmp-image-list__item-image img');
    // For safety, if no image, pass undefined (required by block, but handle gracefully)
    if (!imgEl) imgEl = '';

    // Title (second cell, strongly emphasized, as in example)
    let titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let contentCell = [];
    if (titleSpan) {
      // <strong> for heading style, with link
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      if (titleLink && titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.appendChild(strong);
        contentCell.push(a);
      } else {
        contentCell.push(strong);
      }
    } else if (titleLink) {
      // fallback: just link text
      contentCell.push(document.createTextNode(titleLink.textContent));
    }

    // Description (optional)
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent;
      contentCell.push(descDiv);
    }

    // At least one of title or description must be present
    if (contentCell.length === 0) {
      // fallback: invisible placeholder
      contentCell.push(document.createTextNode(''));
    }

    cells.push([imgEl, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
