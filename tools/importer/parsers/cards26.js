/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block header, as per spec
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all li cards
  const list = element.querySelector('ul.cmp-image-list');
  if (list) {
    const cards = list.querySelectorAll(':scope > li.cmp-image-list__item');
    cards.forEach(card => {
      // --- IMAGE CELL ---
      let imageEl = null;
      const imageLink = card.querySelector('.cmp-image-list__item-image-link');
      if (imageLink) {
        // Find the actual <img> tag inside this link
        imageEl = imageLink.querySelector('img');
      }

      // --- TEXT CELL ---
      const textFragments = [];
      // Title
      const titleLink = card.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan) {
          // Use a <strong> for the title to match example semantics
          const strong = document.createElement('strong');
          strong.textContent = titleSpan.textContent.trim();
          textFragments.push(strong);
        }
      }
      // Description
      const descSpan = card.querySelector('.cmp-image-list__item-description');
      if (descSpan && descSpan.textContent.trim()) {
        // Add <br> between title and description if both exist
        if (textFragments.length > 0) {
          textFragments.push(document.createElement('br'));
        }
        textFragments.push(document.createTextNode(descSpan.textContent.trim()));
      }

      // Push the row for this card
      rows.push([
        imageEl,
        textFragments.length > 0 ? textFragments : ''
      ]);
    });
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
