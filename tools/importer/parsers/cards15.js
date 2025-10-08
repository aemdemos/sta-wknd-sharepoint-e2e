/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards15)'];

  // 2. Find all card items
  // The cards are <li class="cmp-image-list__item"> inside a <ul class="cmp-image-list">
  const cards = Array.from(element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item'));

  // 3. Build rows for each card
  const rows = cards.map((card) => {
    // Image: find the first <img> inside the card
    const img = card.querySelector('img');
    // Defensive: If no image, use null
    const imageCell = img || '';

    // Text cell: Title (as heading), Description
    // Title link (usually an <a> with class 'cmp-image-list__item-title-link')
    const titleLink = card.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    // Create heading element for title
    let headingEl = null;
    if (titleSpan) {
      headingEl = document.createElement('h3');
      // If the title is a link, wrap with <a>
      if (titleLink && titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.textContent = titleSpan.textContent;
        headingEl.appendChild(a);
      } else {
        headingEl.textContent = titleSpan.textContent;
      }
    }
    // Description
    const descSpan = card.querySelector('span.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
    }
    // Compose text cell
    const textCell = [];
    if (headingEl) textCell.push(headingEl);
    if (descEl) textCell.push(descEl);
    // If there is a CTA/link not already used, add it (not present in this HTML)
    return [imageCell, textCell];
  });

  // 4. Compose table cells
  const cells = [headerRow, ...rows];

  // 5. Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element
  element.replaceWith(block);
}
