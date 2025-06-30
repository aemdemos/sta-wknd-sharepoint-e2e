/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Cards (cards22)'];

  // Locate the image list
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  const rows = [headerRow];
  imageList.querySelectorAll('li.cmp-image-list__item').forEach(item => {
    // Image (reference existing element)
    const img = item.querySelector('img.cmp-image__image');

    // Title (bold, on its own line)
    let titleStrong = null;
    const titleSpan = item.querySelector('span.cmp-image-list__item-title');
    if (titleSpan) {
      titleStrong = document.createElement('strong');
      titleStrong.textContent = titleSpan.textContent;
    }

    // Description (plain text, below title)
    const descriptionSpan = item.querySelector('span.cmp-image-list__item-description');

    // Compose the text cell: title (bold, as heading) + description text
    const cellContent = [];
    if (titleStrong) cellContent.push(titleStrong);
    if (descriptionSpan) {
      if (titleStrong) cellContent.push(document.createElement('br'));
      cellContent.push(descriptionSpan);
    }

    // Add row [image, text cell]
    rows.push([
      img,
      cellContent
    ]);
  });

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
