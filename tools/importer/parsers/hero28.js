/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero28)'];

  // 2. Find background image (row 2)
  let imageEl = null;
  // Look for .cmp-teaser__image > div[data-cmp-is="image"] > img
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // 3. Find content (row 3)
  // Title: .cmp-teaser__title
  // Description: .cmp-teaser__description
  // CTA: .cmp-teaser__action-link
  const contentParts = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Title
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) {
      // Use <h1> for hero block title
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML.trim();
      contentParts.push(h1);
    }
    // Description
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      const p = document.createElement('p');
      p.innerHTML = desc.innerHTML.trim();
      contentParts.push(p);
    }
    // CTA
    const cta = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Use the existing <a> element
      contentParts.push(cta);
    }
  }

  // 4. Build table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentParts.length ? contentParts : ''],
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
