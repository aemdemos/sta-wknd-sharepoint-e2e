/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function for direct children selector
  function getImmediateChildByClass(parent, className) {
    return Array.from(parent.children).find((child) => child.classList.contains(className));
  }

  // Find the cmp-teaser--hero block
  let heroBlock = element.querySelector('.cmp-teaser--hero');
  if (!heroBlock) {
    return; // no hero block found, do nothing
  }

  // Get the cmp-teaser block inside hero
  let cmpTeaser = getImmediateChildByClass(heroBlock, 'cmp-teaser');
  if (!cmpTeaser) {
    cmpTeaser = heroBlock; // fallback in case structure changes
  }

  // Extract image
  let imgEl = null;
  let imgContainer = getImmediateChildByClass(cmpTeaser, 'cmp-teaser__image');
  if (imgContainer) {
    let cmpImage = imgContainer.querySelector('[data-cmp-is="image"]');
    if (cmpImage) {
      imgEl = cmpImage.querySelector('img');
    } else {
      imgEl = imgContainer.querySelector('img');
    }
  }

  // Extract Title (should be a heading)
  let contentEl = getImmediateChildByClass(cmpTeaser, 'cmp-teaser__content');
  let titleEl = null;
  if (contentEl) {
    titleEl = contentEl.querySelector('.cmp-teaser__title') || contentEl.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Compose table cells
  const headerRow = ['Hero (hero11)'];
  // Second row: image (optional)
  const imageRow = [imgEl ? imgEl : ''];
  // Third row: Title/Content (optional)
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  // Compose row, cell is array if there is content, else empty string
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
