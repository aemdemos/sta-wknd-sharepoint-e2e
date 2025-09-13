/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for UL of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Header row as required
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Get all LI items (cards)
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    // Find image (first cell)
    let img = li.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if not found
    if (!img) {
      // Try to find any img inside the card
      img = li.querySelector('img');
    }

    // Second cell: text content
    const textContent = [];
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for heading style
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textContent.push(strong);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      textContent.push(document.createElement('br'));
      textContent.push(descSpan);
    }
    // Optional: Call-to-action (if present)
    // In this HTML, the title is already a link, but it's not styled as a CTA, so we skip extra CTA

    // Add row: [image, textContent]
    rows.push([
      img,
      textContent
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
