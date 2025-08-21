/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero/teaser block
  // There may be a responsivegrid wrapper, so find the .cmp-teaser inside
  const teaser = element.querySelector('.cmp-teaser');

  // Prepare the header row
  const headerRow = ['Hero (hero6)'];

  // Prepare the background image row
  let imageCell = '';
  if (teaser) {
    // Look for an image inside the teaser
    const imageWrapper = teaser.querySelector('.cmp-teaser__image [data-cmp-is="image"], .cmp-teaser__image, [data-cmp-is="image"]');
    let img = null;
    if (imageWrapper) {
      img = imageWrapper.querySelector('img');
      if (img) imageCell = img;
      else if (imageWrapper.tagName === 'IMG') imageCell = imageWrapper;
    }
  }

  // Prepare the content row (title, subheading, CTA)
  let contentCell = '';
  if (teaser) {
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      // We'll collect all direct children (heading, subheading, etc) in their order
      const children = Array.from(contentDiv.children);
      if (children.length) {
        contentCell = children.length === 1 ? children[0] : children;
      }
    }
  }

  const cells = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
