/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure .cmp-image-list is present
  const list = element.querySelector('.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));
  const headerRow = ['Cards (cards21)']; // Matches example
  const rows = [headerRow];
  items.forEach((item) => {
    // First column: image (must be referenced, not cloned)
    let imgEl = null;
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }
    // Second column: text content (title and description)
    // Title: extract from title link, use <strong>
    let titleEl = null;
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const titleText = titleSpan.textContent.trim();
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        titleEl = strong;
      }
    }
    // Description: extract from description span
    let descEl = null;
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      descEl = p;
    }
    // Only include non-empty elements
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);
    rows.push([
      imgEl,
      textCell,
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
