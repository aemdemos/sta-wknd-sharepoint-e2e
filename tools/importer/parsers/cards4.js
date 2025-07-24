/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block (the All Articles cards)
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Table header must match example exactly
  const cells = [['Cards (cards4)']];

  // For each card in the list
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Image: grab the first img in the card
    const img = li.querySelector('img');
    
    // Text: gather title and description as elements, in order
    const textElements = [];
    // Title: .cmp-image-list__item-title is a span inside an <a>
    const title = li.querySelector('.cmp-image-list__item-title');
    if (title && title.textContent.trim()) {
      // Use a <strong> for bold effect (per example screenshot)
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textElements.push(strong);
    }
    // Description: .cmp-image-list__item-description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // Add <br> if there's a title, as seen in the example
      if (textElements.length) textElements.push(document.createElement('br'));
      // Place description in a <span> for semantic grouping
      const span = document.createElement('span');
      span.textContent = desc.textContent.trim();
      textElements.push(span);
    }
    // If no text, use empty string
    const textCell = textElements.length ? (textElements.length > 1 ? textElements : textElements[0]) : '';
    // Each card row: [image, text cell]
    cells.push([
      img || '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
