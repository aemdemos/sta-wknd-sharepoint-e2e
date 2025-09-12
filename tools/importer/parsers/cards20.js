/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image-list container
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // Prepare the header row as required
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // For each card/item
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: Find the main content article
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image (img tag inside .cmp-image-list__item-image)
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Use the image link's content (which includes the image)
      // Defensive: Find the image inside the link
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        // fallback: use the whole imageLink if no img found
        imageCell = imageLink;
      }
    }

    // --- TEXT CELL ---
    // Title (span.cmp-image-list__item-title inside a link)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleElem = null;
    if (titleLink) {
      // Use the span inside the link
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Wrap in strong for heading effect
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        titleElem = strong;
      }
    }
    // Description
    const descElem = article.querySelector('.cmp-image-list__item-description');

    // Compose text cell content
    const textCellContent = [];
    if (titleElem) textCellContent.push(titleElem);
    if (descElem) textCellContent.push(document.createElement('br'), descElem);

    // Add row to table
    rows.push([
      imageCell,
      textCellContent.filter(Boolean),
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
