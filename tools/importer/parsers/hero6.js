/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-teaser block (the hero section)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the image inside the hero
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Find the content area (should contain heading, etc)
  let contentElements = [];
  const contentArea = teaser.querySelector('.cmp-teaser__content');
  if (contentArea) {
    // Collect all direct children, trim text content whitespace on headings
    contentElements = Array.from(contentArea.children).map((el) => {
      if (el.tagName.match(/^H[1-6]$/)) {
        // Trim whitespace for headings
        el.textContent = el.textContent.trim();
      }
      return el;
    });
  }

  // Prepare the block cells
  const cells = [
    ['Hero (hero6)'],
    [imageEl ? imageEl : ''],
    [contentElements.length ? contentElements : ''],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
