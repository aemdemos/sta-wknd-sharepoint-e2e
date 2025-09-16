/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists
  if (!element) return;

  // Table header row as specified
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Find all card items (li elements)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // Defensive: find the card content container
    const content = item.querySelector('article.cmp-image-list__item-content');
    if (!content) return;

    // --- IMAGE CELL ---
    // Find the image element inside the card
    let imgEl = null;
    const imageDiv = content.querySelector('.cmp-image-list__item-image');
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }
    // Defensive: if no image, skip this card
    if (!imgEl) return;

    // --- TEXT CELL ---
    // Title (usually inside a link)
    let titleEl = content.querySelector('.cmp-image-list__item-title');
    // Description
    let descEl = content.querySelector('.cmp-image-list__item-description');

    // Compose text cell content
    const textCell = [];
    if (titleEl) {
      // Wrap title in <strong> for heading style
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      textCell.push(strong);
    }
    if (descEl) {
      // Add description below title
      const p = document.createElement('p');
      p.textContent = descEl.textContent;
      textCell.push(p);
    }

    // Add row: [image, text content]
    rows.push([imgEl, textCell]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
