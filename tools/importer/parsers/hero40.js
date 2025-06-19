/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the image element (background image for Hero row 2)
  let imageRow = [''];
  const imgEl = element.querySelector('.cmp-teaser__image img');
  if (imgEl) {
    imageRow = [imgEl];
  }

  // 2. Get all content for the third row (headline, subheading, description, cta, vertical order)
  const content = element.querySelector('.cmp-teaser__content');
  const cellContent = [];
  if (content) {
    // pretitle (subheading, e.g. 'Featured Article')
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim() !== '') {
      cellContent.push(pretitle);
    }
    // title (main heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim() !== '') {
      cellContent.push(title);
    }
    // description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim() !== '') {
      cellContent.push(desc);
    }
    // cta (button)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim() !== '') {
      cellContent.push(cta);
    }
  }

  // 3. Build the table header (MUST be plain text 'Hero' per the example)
  const headerRow = ['Hero'];

  // 4. Compose table rows (1 col, 3 rows)
  const cells = [
    headerRow,
    imageRow,
    [cellContent]
  ];

  // 5. Create block table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
