/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example exactly
  const cells = [['Cards (cards40)']];

  // Defensive: find the image-list UL
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;
    // Image: <img> inside .cmp-image-list__item-image
    let imageEl = null;
    const imageDiv = article.querySelector('.cmp-image-list__item-image');
    if (imageDiv) imageEl = imageDiv.querySelector('img');

    // Text: title (strong) and description
    // Reference existing elements, not cloning!
    let titleStrong = null;
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use a <strong> for the title, matching the markdown's heading intent
        titleStrong = document.createElement('strong');
        titleStrong.textContent = titleSpan.textContent.trim();
      }
    }
    const descSpan = article.querySelector('.cmp-image-list__item-description');

    // Build the text cell content, referencing nodes (not cloning or creating text nodes)
    const textCell = [];
    if (titleStrong) {
      textCell.push(titleStrong);
    }
    if (descSpan) {
      // If there is a title, add a <br> between title and description
      if (titleStrong) textCell.push(document.createElement('br'));
      textCell.push(descSpan);
    }

    // Add the row for this card
    cells.push([imageEl, textCell]);
  });

  // Create and replace with the new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
