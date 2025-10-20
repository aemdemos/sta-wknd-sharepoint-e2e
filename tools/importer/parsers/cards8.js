/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards8) block parser
  // 1. Find the parent container for cards
  // 2. For each card, extract image, title, description
  // 3. Build a table with header and card rows

  // Header row as per spec
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  // Find the <ul class="cmp-image-list"> inside the block
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Get all <li class="cmp-image-list__item"> (each is a card)
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((li) => {
    // Image: find the <img> inside the card
    const img = li.querySelector('img');

    // Text content: title and description
    // Title: <span class="cmp-image-list__item-title">
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    // Description: <span class="cmp-image-list__item-description">
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    // Link: <a class="cmp-image-list__item-title-link">
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');

    // Compose text cell
    // Title as heading (use <strong> for visual boldness)
    let textCellContent = [];
    if (titleSpan) {
      let titleElem;
      if (titleLink) {
        // Wrap title in link if present
        titleElem = document.createElement('a');
        titleElem.href = titleLink.getAttribute('href');
        // Use <strong> for heading style
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        titleElem.appendChild(strong);
      } else {
        // Just strong
        titleElem = document.createElement('strong');
        titleElem.textContent = titleSpan.textContent;
      }
      textCellContent.push(titleElem);
    }
    if (descSpan) {
      // Add description below title
      textCellContent.push(document.createElement('br'));
      textCellContent.push(descSpan);
    }

    // Add row: [image, text content]
    rows.push([
      img,
      textCellContent
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
