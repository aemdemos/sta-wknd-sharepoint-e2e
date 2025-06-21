/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row: must match example exactly
  const headerRow = ['Hero'];

  // 2. Background image row (can be empty if no image)
  let imgEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imgEl = imageWrapper.querySelector('img');
  }

  // 3. Content row: Title (as h1), Description, CTA (all optional, all in one cell, preserve semantic meaning)
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  const contentElements = [];
  if (contentWrapper) {
    // Title (as h1, but if existing heading is h2, reference it directly; do not clone or create new unless necessary)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) {
      // The example markdown shows the heading as a block heading (e.g. # **Heading in Block**), so use h1 for semantic meaning
      let blockHeading = title;
      if (title.tagName.toLowerCase() !== 'h1') {
        // Create a new h1 and move the content (not clone)
        const h1 = document.createElement('h1');
        h1.innerHTML = title.innerHTML;
        blockHeading = h1;
      }
      contentElements.push(blockHeading);
    }
    // Description as paragraph
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim() !== '') {
      // Wrap description in <p> if not already
      let descNode = desc;
      if (desc.tagName.toLowerCase() !== 'p') {
        const p = document.createElement('p');
        p.innerHTML = desc.innerHTML;
        descNode = p;
      }
      contentElements.push(descNode);
    }
    // CTA link (if present)
    const cta = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentElements.push(cta);
    }
  }

  // Build the table (1 column, 3 rows: header, image, content)
  const rows = [
    headerRow,
    [imgEl ? imgEl : ''],
    [contentElements]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  
  // Replace the original element with the table
  element.replaceWith(table);
}
