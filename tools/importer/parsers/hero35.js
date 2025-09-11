/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image at the top of the block
  let heroImage = null;
  const firstContainer = element.querySelector('.cmp-container');
  if (firstContainer) {
    const firstGrid = firstContainer.querySelector('.aem-Grid');
    if (firstGrid) {
      const imageDiv = firstGrid.querySelector('.image');
      if (imageDiv) {
        heroImage = imageDiv.querySelector('img');
      }
    }
  }

  // Find the main title and subtitle (author)
  let titleEl = null;
  let subtitleEl = null;
  const nestedMain = element.querySelector('main.container .cmp-container');
  if (nestedMain) {
    const titleBlocks = nestedMain.querySelectorAll('.title .cmp-title');
    if (titleBlocks.length > 0) {
      // First title is the main heading
      const h1 = titleBlocks[0].querySelector('h1');
      if (h1) titleEl = h1.cloneNode(true);
      // Second title is the author/byline
      if (titleBlocks.length > 1) {
        const h4 = titleBlocks[1].querySelector('h4');
        if (h4) subtitleEl = h4.cloneNode(true);
      }
    }
  }

  // Compose the content cell: title (heading), subtitle (author)
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (subtitleEl) contentCell.push(subtitleEl);

  // Build the table rows
  const headerRow = ['Hero (hero35)'];
  const imageRow = [heroImage ? heroImage : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
