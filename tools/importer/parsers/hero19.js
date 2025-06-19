/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image element if present
  let img = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    img = imageWrapper.querySelector('img');
  }

  // Extract the content: title and description
  let title = null;
  let desc = null;
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    title = content.querySelector('.cmp-teaser__title');
    desc = content.querySelector('.cmp-teaser__description');
  }

  // Compose the content cell for the 3rd row: heading and description
  const contentCell = [];
  if (title) {
    // Convert the title to an h1, as in the example markdown
    const h1 = document.createElement('h1');
    h1.innerHTML = title.innerHTML;
    contentCell.push(h1);
  }
  if (desc) {
    // Add all children (such as paragraphs)
    contentCell.push(...desc.childNodes);
  }

  // Build the cells array according to the required block table format
  const cells = [
    ['Hero'],
    [img ? img : ''],
    [contentCell.length > 0 ? contentCell : '']
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
