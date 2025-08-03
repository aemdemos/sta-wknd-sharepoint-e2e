/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must match exactly)
  const headerRow = ['Hero (hero27)'];

  // Second row: Background image (optional)
  // Get the image element directly (not a clone)
  let bgImage = '';
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      bgImage = img;
    }
  }
  const imageRow = [bgImage];

  // Third row: Title, subheading (description), CTA
  const contentArr = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Title (Heading)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentArr.push(title);
    // Subheading (Description)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentArr.push(desc);
    // CTA (link)
    const cta = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (cta) contentArr.push(cta);
  }
  const contentRow = [contentArr];

  // Construct table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
