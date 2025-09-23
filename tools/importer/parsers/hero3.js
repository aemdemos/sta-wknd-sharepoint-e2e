/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.cmp-teaser--hero');
  if (!heroTeaser) return;

  // Extract image element (background image)
  let imageEl = '';
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) imageEl = img;
  }

  // Extract all content (title, subheading, CTA) into a single cell for the third row
  let contentCell = '';
  const contentWrapper = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Collect all children (title, subheading, CTA) into an array
    const contentChildren = Array.from(contentWrapper.children);
    if (contentChildren.length) {
      contentCell = contentChildren;
    } else {
      contentCell = '';
    }
  } else {
    contentCell = '';
  }

  // Compose table rows
  const headerRow = ['Hero (hero3)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell ? contentCell : ''];

  // Ensure there are always 3 rows: header, image, text (even if text is empty)
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
