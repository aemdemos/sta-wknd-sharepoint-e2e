/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: block name as a single-cell row
  const headerRow = ['Carousel (carousel40)'];

  // Find the image element for the left column
  let imgEl = element.querySelector('.cmp-teaser__image img');
  if (!imgEl) {
    imgEl = element.querySelector('img');
  }

  // Gather right column content
  const textContent = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Pretitle
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textContent.push(pretitle);
    }
    // Title
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textContent.push(title);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textContent.push(desc);
    }
    // CTA/link
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      textContent.push(cta);
    }
  }

  // Build table: first row is single-cell header, then content row(s) with 2 cells
  const cells = [
    headerRow, // one cell in header row
    [imgEl, textContent] // two cells in content row
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
