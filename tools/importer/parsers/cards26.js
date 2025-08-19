/* global WebImporter */
export default function parse(element, { document }) {
  // Table header per instructions
  const headerRow = ['Cards (cards26)'];

  // Find the list of card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = Array.from(ul.querySelectorAll('li.cmp-image-list__item'));
  if (items.length === 0) return;

  const rows = [headerRow];

  items.forEach((li) => {
    // First column: image
    let imageCell = '';
    const img = li.querySelector('img');
    if (img) imageCell = img;

    // Second column: text (title as heading or strong, description)
    const content = li.querySelector('article.cmp-image-list__item-content');
    let textParts = [];

    // Title
    let titleLink = content && content.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      let titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      const strong = document.createElement('strong');
      if (titleSpan) {
        strong.textContent = titleSpan.textContent.trim();
      } else {
        strong.textContent = titleLink.textContent.trim();
      }
      textParts.push(strong);
    }

    // Description
    const desc = content && content.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim() !== '') {
      // Add a <br> only if there is a title
      if (textParts.length > 0) {
        textParts.push(document.createElement('br'));
      }
      textParts.push(desc);
    }

    // If no title or description, still push an empty string to retain structure
    if (textParts.length === 0) {
      textParts = [''];
    }

    rows.push([
      imageCell,
      textParts
    ]);
  });

  // Create the table per instructions
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
