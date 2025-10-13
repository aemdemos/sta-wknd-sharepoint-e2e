/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero39)'];

  // 2. Find the hero image (reference the existing <img> element)
  let imageEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }

  // 3. Find the hero text content (preserve heading and description)
  const teaserContentDiv = element.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (teaserContentDiv) {
    // Heading: use actual heading element, preserve level
    const heading = teaserContentDiv.querySelector('.cmp-teaser__title, h1, h2, h3');
    if (heading) contentEls.push(heading);
    // Description: use actual paragraph element
    const desc = teaserContentDiv.querySelector('.cmp-teaser__description p, .cmp-teaser__description, p');
    if (desc) contentEls.push(desc);
  }

  // 4. Build table rows (always 3 rows)
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEls.length ? contentEls : ''],
  ];

  // 5. Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace original element with block table
  element.replaceWith(table);
}
