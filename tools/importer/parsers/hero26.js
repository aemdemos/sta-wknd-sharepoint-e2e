/* global WebImporter */
export default function parse(element, { document }) {
  // Find the background image (if any)
  let imageEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageEl = img;
    }
  }

  // Compose the content cell: Title, Description, CTA
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentContainer) {
    // Title
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // Call to Action
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentParts.push(ctaLink);
    }
  }

  // Build the table rows: header, image, content
  const cells = [
    ['Hero (hero26)'],
    [imageEl ? imageEl : ''],
    [contentParts]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
