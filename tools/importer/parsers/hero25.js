/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.cmp-teaser');

  // Get background image (first <img> in .cmp-teaser__image)
  let backgroundImage = null;
  if (teaser) {
    const teaserImage = teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      backgroundImage = teaserImage;
    }
  }

  // Get the title/content area (all children of .cmp-teaser__content)
  let contentElements = [];
  if (teaser) {
    const teaserContent = teaser.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      contentElements = Array.from(teaserContent.children);
    }
  }

  // Compose the table cells
  const cells = [
    ['Hero (hero25)'], // Table header exactly as specified
    [backgroundImage ? backgroundImage : ''], // Background image row
    [contentElements.length > 0 ? contentElements : ''] // Content row
  ];

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
