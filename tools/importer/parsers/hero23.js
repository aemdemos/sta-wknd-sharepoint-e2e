/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block (the .cmp-teaser--hero div)
  const heroBlock = element.querySelector('.teaser.cmp-teaser--hero');
  if (!heroBlock) return;

  // Get the background image (2nd row)
  let imageEl = '';
  const imageWrapper = heroBlock.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) imageEl = img;
  }

  // Get content for 3rd row: headline, subheadline, CTA, etc.
  let contentEls = '';
  const contentWrapper = heroBlock.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Only add if there are children (e.g. h2, p, etc.)
    if (contentWrapper.children.length > 0) {
      contentEls = Array.from(contentWrapper.children);
    }
  }

  // Compose the block table
  const cells = [
    ['Hero (hero23)'],
    [imageEl],
    [contentEls && contentEls.length ? contentEls : '']
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
