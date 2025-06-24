/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the featured teaser (Hero block)
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  let heroImageCell = '';
  let heroContentCell = '';

  if (featuredTeaser) {
    // For the image cell: reference the image container if present, else empty string
    const imgContainer = featuredTeaser.querySelector('.cmp-teaser__image');
    heroImageCell = imgContainer ? imgContainer : '';

    // For the content cell: reference the whole content container so all text and structure are preserved
    const contentContainer = featuredTeaser.querySelector('.cmp-teaser__content');
    heroContentCell = contentContainer ? contentContainer : '';
  }

  // 2. Compose table matching the example exactly: 1 column, 3 rows (header, image, text content)
  const cells = [
    ['Hero'],
    [heroImageCell],
    [heroContentCell],
  ];

  // 3. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
