/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Get all <li> for each card
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
      // IMAGE cell: use the <img> element directly
      let imageCell = '';
      const imageLink = li.querySelector('.cmp-image-list__item-image-link');
      if (imageLink) {
        const img = imageLink.querySelector('img');
        if (img) imageCell = img;
      }
      // TEXT cell: title (as strong), description (as div), all present text
      const textCellContent = [];
      // Title: render as <strong> (matching heading style in example)
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan && titleSpan.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = titleSpan.textContent.trim();
          textCellContent.push(strong);
        }
      }
      // Description: as div, under the title
      const descSpan = li.querySelector('.cmp-image-list__item-description');
      if (descSpan && descSpan.textContent.trim()) {
        const descDiv = document.createElement('div');
        descDiv.textContent = descSpan.textContent.trim();
        textCellContent.push(descDiv);
      }
      rows.push([imageCell, textCellContent]);
    });
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
