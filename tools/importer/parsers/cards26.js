/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block, must match example
  const headerRow = ['Cards (cards26)'];

  // Find the list of cards (ul)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');
  if (!items.length) return;

  const rows = [headerRow];

  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    let img = null;
    const imgContainer = article.querySelector('.cmp-image-list__item-image');
    if (imgContainer) {
      // Use the <img> element as-is
      img = imgContainer.querySelector('img');
    }

    // --- TEXT CELL ---
    const cellContent = [];
    
    // Title: Use <strong> for visual, but preserve anchor structure if present (reference existing element)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // We'll reference the link directly, but wrap inner span with <strong> for heading effect
        // Replace span in anchor with <strong> (so it matches the expected style)
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        // Replace the span in the anchor with <strong>
        titleLink.replaceChild(strong, titleSpan);
        cellContent.push(titleLink);
      }
    }

    // Description: If present, add as plain text (span or as-is)
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Add a <br> before description only if a title exists
      if (cellContent.length > 0) {
        cellContent.push(document.createElement('br'));
      }
      cellContent.push(desc);
    }

    // Compose row: always two columns (image, content)
    rows.push([
      img,
      cellContent
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
