/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a <li> element
  function extractCard(li) {
    // Find the image (first <img> descendant)
    const img = li.querySelector('img');

    // Find the title (the <span class="cmp-image-list__item-title">)
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    let titleEl;
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
    }

    // Find the description (the <span class="cmp-image-list__item-description">)
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descEl;
    if (descSpan) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent.trim();
    }

    // Find the CTA (the <a class="cmp-image-list__item-title-link">)
    const ctaLink = li.querySelector('.cmp-image-list__item-title-link');
    let ctaEl;
    if (ctaLink) {
      ctaEl = document.createElement('a');
      ctaEl.href = ctaLink.href;
      ctaEl.textContent = ctaLink.textContent.trim();
    }

    // Compose the text cell: title (strong), description (div), CTA (a)
    const textCell = document.createElement('div');
    if (titleEl) textCell.appendChild(titleEl);
    if (descEl) {
      if (titleEl) textCell.appendChild(document.createElement('br'));
      textCell.appendChild(descEl);
    }
    // Only add CTA if it's not just duplicating the title
    if (ctaEl && ctaEl.textContent && (!titleEl || ctaEl.textContent !== titleEl.textContent)) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(ctaEl);
    }

    return [img, textCell];
  }

  // Start building the table rows
  const rows = [];
  // Header row as specified
  rows.push(['Cards (cards14)']);

  // Find all <li class="cmp-image-list__item">
  const items = element.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    const cardRow = extractCard(li);
    rows.push(cardRow);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
