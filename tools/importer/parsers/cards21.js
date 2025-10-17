/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block parser
  // 1. Find the parent container holding the cards
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // 2. Find all card items (li elements)
  const cardItems = imageList.querySelectorAll('li.cmp-image-list__item');
  if (!cardItems.length) return;

  // 3. Prepare the table rows
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  cardItems.forEach((li) => {
    // Each card is an li with an article inside
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- Image cell ---
    // Find the image inside the card
    let img = article.querySelector('.cmp-image-list__item-image img');
    // Defensive: If not found, fallback to any img in article
    if (!img) img = article.querySelector('img');
    // If still not found, skip this card
    if (!img) return;

    // --- Text cell ---
    // Title: Use the span with class 'cmp-image-list__item-title'
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    let titleEl;
    if (titleSpan) {
      titleEl = document.createElement('h3');
      titleEl.textContent = titleSpan.textContent;
    }

    // Description: Use the span with class 'cmp-image-list__item-description'
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    let descEl;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
    }

    // Compose the text cell (NO CTA, per requirements)
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);

    // Add the row: [image, text content]
    rows.push([img, textCellContent]);
  });

  // 4. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the original element
  element.replaceWith(block);
}
