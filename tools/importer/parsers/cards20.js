/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards20) block: 2 columns, multiple rows, header row is block name
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find the card container
  const imageList = element.querySelector('.image-list.list, .cmp-image-list');
  // Defensive: if not found, fallback to first ul with card items
  const ul = imageList ? imageList.querySelector('ul.cmp-image-list') : element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Each li.cmp-image-list__item is a card
  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // Card image (first column)
    let imageEl = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }
    // Defensive: fallback to any img inside li
    if (!imageEl) {
      imageEl = li.querySelector('img');
    }

    // Card text (second column)
    const textContent = [];
    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for heading style
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textContent.push(strong);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Use <p> for description
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textContent.push(p);
    }
    // Call-to-action: if titleLink exists and is not just the title, add as CTA link at bottom
    // (In this source, titleLink is just the title, so skip CTA)

    // Build row: [image, textContent]
    rows.push([imageEl, textContent]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
