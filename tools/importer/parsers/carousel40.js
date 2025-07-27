/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as a single column, per requirements
  const headerRow = ['Carousel (carousel40)'];

  // Get image element from inside cmp-teaser__image
  let imgEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }

  // Gather text content (pretitle, title, description, cta)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const textCol = [];
  if (contentContainer) {
    // pretitle (optional)
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) textCol.push(pretitle);
    // title (optional)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) textCol.push(title);
    // description (optional)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) textCol.push(desc);
    // cta (optional)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) textCol.push(cta);
  }

  // Compose the slide row: two columns, first is image, second is text content
  const rows = [];
  if (imgEl) {
    rows.push([imgEl, textCol.length ? textCol : '']);
  }

  // Compose the table data: single header row (1 col), then rows (2 cols)
  const tableCells = [headerRow, ...rows];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
