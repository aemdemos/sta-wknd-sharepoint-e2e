/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Hero (hero38)'];

  // Find the image element (background image)
  let imageEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // Find the content block (title + description)
  let contentEls = [];
  const teaserContentDiv = element.querySelector('.cmp-teaser__content');
  if (teaserContentDiv) {
    // Find title (h2)
    const titleEl = teaserContentDiv.querySelector('.cmp-teaser__title');
    if (titleEl) {
      contentEls.push(titleEl);
    }
    // Find description (div > p)
    const descDiv = teaserContentDiv.querySelector('.cmp-teaser__description');
    if (descDiv) {
      const descP = descDiv.querySelector('p');
      if (descP) {
        contentEls.push(descP);
      }
    }
  }
  const contentRow = [contentEls.length > 0 ? contentEls : ''];

  // Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
