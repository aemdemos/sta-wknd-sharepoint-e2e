/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero27) block: 1 column, 3 rows
  // Row 1: block name
  // Row 2: background image (optional)
  // Row 3: heading, subheading, CTA (optional)

  // Header row
  const headerRow = ['Hero (hero27)'];

  // --- Row 2: Background Image ---
  // Find image element inside the teaser block
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // --- Row 3: Content (heading, description, CTA) ---
  const contentArr = [];
  // Find teaser content container
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('.cmp-teaser__title');
    if (heading) contentArr.push(heading);
    // Description (subheading)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentArr.push(desc);
    // CTA link
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentArr.push(ctaLink);
    }
  }
  const contentRow = [contentArr];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
