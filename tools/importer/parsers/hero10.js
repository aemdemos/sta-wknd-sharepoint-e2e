/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const hero = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!hero) return;

  // Find the main teaser inside the hero
  const teaser = hero.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the background image (if any)
  let imgElem = null;
  const imageDiv = teaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageDiv) {
    imgElem = imageDiv.querySelector('img');
  }

  // Find the content: title, subheading, cta (if any)
  const contentDiv = teaser.querySelector('.cmp-teaser__content');
  let contentFragments = [];
  if (contentDiv) {
    // Only reference existing direct children to preserve headings etc
    contentFragments = Array.from(contentDiv.children);
  }

  // Compose table
  const cells = [];
  // Table header EXACTLY as the specification
  cells.push(['Hero (hero10)']);
  // Image row
  cells.push([imgElem ? imgElem : '']);
  // Content row: include all found elements in a single cell, even if only one
  cells.push([contentFragments.length ? contentFragments : '']);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
