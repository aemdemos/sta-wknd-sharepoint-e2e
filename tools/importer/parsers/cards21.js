/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Cards (cards21)'];
  const rows = [];

  // Find the image-list ul
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Loop through each card list item
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // IMAGE CELL
    let img = null;
    const imgLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }

    // TEXT CELL: strong title, then description below
    const textCellContent = [];
    // Title as strong heading
    const titleSpan = article.querySelector('span.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCellContent.push(strong);
    }
    // Description
    const desc = article.querySelector('span.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // If title exists, add <br> for line break
      if (textCellContent.length > 0) {
        textCellContent.push(document.createElement('br'));
      }
      // Use a span to hold description
      textCellContent.push(desc);
    }

    rows.push([
      img,
      textCellContent
    ]);
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
