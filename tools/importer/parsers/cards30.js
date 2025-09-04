/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the UL containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header as specified
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Get all LI items (cards)
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    // Defensive: Find the article containing card content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image element inside the card
    let imageEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the actual <img> inside the image link
      imageEl = imageLink.querySelector('img');
    }
    // Defensive: If no image, skip this card
    if (!imageEl) return;

    // --- TEXT CELL ---
    // Title (usually inside a link)
    let titleEl = article.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleEl ? titleEl.querySelector('.cmp-image-list__item-title') : null;
    // Description
    let descEl = article.querySelector('.cmp-image-list__item-description');
    // Compose text cell contents
    const textCell = [];
    if (titleSpan) {
      // Make the title bold (using <strong>)
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCell.push(strong);
    }
    if (descEl) {
      // Add description below title
      textCell.push(document.createTextNode(' ')); // spacing
      textCell.push(descEl);
    }
    // Optionally add CTA link if present (not in this HTML, but future-proof)
    // If the title is a link, add it as CTA at the end
    if (titleEl && titleEl.href) {
      // Only add CTA if not already included in title
      // But in this block, the title is not a CTA, so skip
    }
    // Defensive: If no title or description, skip this card
    if (!textCell.length) return;

    // Add the row: [image, text]
    rows.push([imageEl, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
