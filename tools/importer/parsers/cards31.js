/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block name as the header row.
  const rows = [['Cards (cards31)']];

  // Find all cards in the list
  const cards = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  cards.forEach((card) => {
    // --- IMAGE COLUMN ---
    // Always select the <img> element
    const img = card.querySelector('img');
    const imageCell = img || '';

    // --- TEXT COLUMN ---
    // Title (as bold or heading)
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = card.querySelector('.cmp-image-list__item-title');
    let titleElement;
    if (titleSpan) {
      // Use <strong> to match visual bolding
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      if (titleLink) {
        // Wrap with link if present
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.append(strong);
        titleElement = link;
      } else {
        titleElement = strong;
      }
    }
    // Description
    const descSpan = card.querySelector('.cmp-image-list__item-description');
    let descriptionElement = '';
    if (descSpan && descSpan.textContent && descSpan.textContent.trim().length > 0) {
      // Use <div> for description for easy stacking
      descriptionElement = document.createElement('div');
      descriptionElement.textContent = descSpan.textContent;
    }
    // Compose contents for text cell
    // No extra markup if any field missing
    const cellContents = [];
    if (titleElement) cellContents.push(titleElement);
    if (descriptionElement) cellContents.push(descriptionElement);
    rows.push([
      imageCell,
      cellContents.length === 1 ? cellContents[0] : cellContents
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
