/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as in the markdown example
  const rows = [['Cards (cards15)']];

  // Get the list of cards (li elements)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // ===== Image Cell =====
    let imageEl = null;
    const imageAnchor = item.querySelector('.cmp-image-list__item-image-link');
    if (imageAnchor) {
      imageEl = imageAnchor.querySelector('img');
    }
    
    // ===== Text Cell =====
    const textParts = [];
    // Title (as <strong> like markdown example)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textParts.push(strong);
      }
    }
    // Description (on new line)
    const description = item.querySelector('.cmp-image-list__item-description');
    if (description && description.textContent.trim()) {
      textParts.push(document.createElement('br'));
      textParts.push(description.textContent.trim());
    }
    // No separate CTA in this HTML: title is the link, so nothing more needed
    // Insert row (image cell, text cell)
    rows.push([
      imageEl,
      textParts.length > 1 ? textParts : textParts[0] // use array if both strong and description, else just the strong
    ]);
  });

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
