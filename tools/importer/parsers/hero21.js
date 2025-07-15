/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero21)'];

  // 2. Image row (background image)
  let imageEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Only use the actual <img> tag (not the container)
    imageEl = imageWrapper.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row (title, description, CTA...)
  const contentEls = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Title: could be any heading (here it is h2, but future-proof for h1-h6)
    const heading = contentWrapper.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentEls.push(heading);
    // Description (may contain <p>)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // CTA is not present in this HTML, but we would add here if it were
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Table rows for the block
  const tableRows = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
