/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate image element for background
  let imgElem = element.querySelector('.cmp-teaser__image img');

  // Helper: get the content (title, description, etc.)
  let contentDiv = element.querySelector('.cmp-teaser__content');
  const textContentFragments = [];
  if (contentDiv) {
    // Title as heading, make it h1 for hero
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // If it's already h1, use as is, else create h1 for correct semantic
      let heading;
      if (title.tagName.toLowerCase() === 'h1') {
        heading = title;
      } else {
        heading = document.createElement('h1');
        heading.innerHTML = title.innerHTML;
      }
      textContentFragments.push(heading);
    }
    // Description: add inner elements as-is
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      // Add all direct children (usually paragraphs)
      Array.from(desc.children).forEach((child) => {
        textContentFragments.push(child);
      });
    }
  }

  // Compose output block table: header, image row, content row
  // The table must have exactly the structure in the example (3 rows, 1 column; second row is image, third row is text content)
  const cells = [
    ['Hero'],
    [imgElem ? imgElem : ''],
    [textContentFragments.length > 0 ? textContentFragments : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
