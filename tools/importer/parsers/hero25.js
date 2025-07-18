/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.cmp-teaser');
  let imgEl = null;
  let contentEl = null;

  if (teaser) {
    // Image: Find the <img> inside .cmp-teaser__image (if available)
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // Content: Get the <div class="cmp-teaser__content"> which usually contains the title/heading
    const contentContainer = teaser.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      contentEl = contentContainer;
    }
  }

  // Build the block table as per spec
  const headerRow = ['Hero (hero25)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [contentEl ? contentEl : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
