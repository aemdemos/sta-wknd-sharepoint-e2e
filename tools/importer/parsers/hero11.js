/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main hero block container
  let heroContainer = element.querySelector('.cmp-teaser--hero');
  if (!heroContainer) {
    // Fallback: try to find any .cmp-teaser inside the element
    heroContainer = element.querySelector('.cmp-teaser');
  }
  if (!heroContainer) return;

  // Find the image element (background image)
  let imageCell = '';
  const imageWrapper = heroContainer.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Find the title (headline)
  let contentCell = '';
  const contentWrapper = heroContainer.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Use all children (could be h2, p, etc.)
    const children = Array.from(contentWrapper.children);
    if (children.length) {
      contentCell = children.length === 1 ? children[0] : children;
    }
  }

  // Table rows
  const headerRow = ['Hero (hero11)'];
  const imageRow = [imageCell];
  const contentRow = [contentCell];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
