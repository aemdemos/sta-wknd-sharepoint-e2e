/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the UL containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Get all LI items (cards)
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // Defensive: Find the article containing card content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image inside the card
    let imageEl = article.querySelector('.cmp-image-list__item-image img');
    // Defensive: If not found, fallback to any img
    if (!imageEl) {
      imageEl = article.querySelector('img');
    }

    // --- TEXT CELL ---
    // Title (as heading)
    let titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let titleText = titleSpan ? titleSpan.textContent.trim() : '';
    let titleHref = titleLink ? titleLink.getAttribute('href') : '';
    // Create heading element
    let headingEl = null;
    if (titleText) {
      headingEl = document.createElement('h3');
      headingEl.textContent = titleText;
      // If there's a link, wrap heading in link
      if (titleHref) {
        const linkEl = document.createElement('a');
        linkEl.href = titleHref;
        linkEl.appendChild(headingEl);
        headingEl = linkEl;
      }
    }

    // Description
    let descSpan = article.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan && descSpan.textContent.trim()) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent.trim();
    }

    // Compose text cell
    const textCellContent = [];
    if (headingEl) textCellContent.push(headingEl);
    if (descEl) textCellContent.push(descEl);

    // Add row: [image, text]
    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
