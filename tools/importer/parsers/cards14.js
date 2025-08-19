/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Get the cards list
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // For each card
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Image (first column)
    const img = li.querySelector('.cmp-image-list__item-image img');
    const imageCell = img || null;

    // Text (second column): Title (with link) and description
    // Title (strong, inside link if available)
    let titleEl = null;
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for the title for semantic meaning
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        // Wrap in link
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.appendChild(strong);
        titleEl = a;
      }
    }
    // Description
    let descEl = null;
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim() !== '') {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      descEl = p;
    }

    // Compose text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);
    // Always make textCell an array, even if empty
    rows.push([imageCell, textCell]);
  });

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
