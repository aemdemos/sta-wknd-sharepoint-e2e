/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get the inner cmp-teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get image element (background image)
  let imgEl = null;
  const imgWrapper = teaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imgWrapper) {
    imgEl = imgWrapper.querySelector('img');
  }

  // Get content: heading and description
  const content = teaser.querySelector('.cmp-teaser__content');
  let headingEl = null;
  let descriptionEl = null;
  if (content) {
    headingEl = content.querySelector('.cmp-teaser__title');
    descriptionEl = content.querySelector('.cmp-teaser__description');
  }

  // Table rows
  const headerRow = ['Hero (hero27)'];
  const imageRow = [imgEl ? imgEl : ''];
  // Combine heading and description into one cell, preserving structure
  const textCell = [];
  if (headingEl) textCell.push(headingEl);
  if (descriptionEl) textCell.push(descriptionEl);
  const contentRow = [textCell.length ? textCell : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
