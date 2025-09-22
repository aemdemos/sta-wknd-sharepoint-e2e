/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero39)'];

  // 2. Image row (background image)
  let imageCell = '';
  const teaserImageWrapper = element.querySelector('.cmp-teaser__image');
  if (teaserImageWrapper) {
    const img = teaserImageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // 3. Content row (title, description, CTA)
  let contentCell = [];
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Title
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) {
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      contentCell.push(h1);
    }
    // Description
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      const p = desc.querySelector('p');
      if (p) {
        contentCell.push(p);
      } else {
        contentCell.push(desc);
      }
    }
    // CTA (optional)
    const cta = teaserContent.querySelector('a');
    if (cta) {
      contentCell.push(cta);
    }
  }

  // Only output 3 rows: header, image, content (no extra empty row)
  const rows = [
    headerRow,
    [imageCell || ''],
    [contentCell.length ? contentCell : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
