/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const rows = [['Cards (cards31)']];

  // Find all card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    const article = li.querySelector('article');
    
    // Extract image (first cell)
    let img = null;
    const imageDiv = article && article.querySelector('.cmp-image-list__item-image');
    if (imageDiv) {
      img = imageDiv.querySelector('img');
    }

    // Extract text content (second cell)
    let textCellContent = [];
    // Title
    const titleLink = article && article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink && titleLink.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // Use <strong> for visual bolding to match the example
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCellContent.push(strong);
    }
    // Description
    const description = article && article.querySelector('.cmp-image-list__item-description');
    if (description && description.textContent.trim()) {
      // Put <br> between title and description if both exist
      if (textCellContent.length > 0) {
        textCellContent.push(document.createElement('br'));
      }
      textCellContent.push(description);
    }
    // If no title or description, add empty string to preserve cell
    if (textCellContent.length === 0) {
      textCellContent = [''];
    }
    rows.push([
      img,
      textCellContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
