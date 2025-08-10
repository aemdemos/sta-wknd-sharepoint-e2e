/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list (cards) block
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Build table header as per the example
  const rows = [['Cards (cards4)']];

  // Each li.cmp-image-list__item is a card
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach(card => {
    // Extract the image (first <img> in the card)
    const img = card.querySelector('img');

    // Compose text cell, referencing existing elements from the DOM
    const textFragments = [];

    // Title: Use the text content of .cmp-image-list__item-title if available
    const titleEl = card.querySelector('.cmp-image-list__item-title');
    if (titleEl) {
      // Use a <div> with <strong> for semantic heading (matches markdown intent)
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textFragments.push(strong);
    }

    // Description: Append below with <br><br> if there was a title
    const descEl = card.querySelector('.cmp-image-list__item-description');
    if (descEl) {
      if (textFragments.length > 0) {
        textFragments.push(document.createElement('br'));
        textFragments.push(document.createElement('br'));
      }
      // Reference the existing element, not a cloned one
      textFragments.push(descEl);
    }

    // Compose row
    rows.push([
      img,
      textFragments
    ]);
  });

  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
