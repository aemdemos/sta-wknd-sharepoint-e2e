/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block. It's the first occurrence of .cmp-teaser--hero
  const heroBlock = element.querySelector('.cmp-teaser--hero');
  if (!heroBlock) return;

  // --- Find the background image (img element) ---
  let imgEl = null;
  const imgContainer = heroBlock.querySelector('.cmp-teaser__image .cmp-image');
  if (imgContainer) {
    imgEl = imgContainer.querySelector('img');
  }

  // --- Find the heading/title ---
  let contentDiv = heroBlock.querySelector('.cmp-teaser__content');
  let titleEl = null;
  if (contentDiv) {
    titleEl = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Prepare content cell for row 3
  const contentCell = [];
  if (titleEl) {
    contentCell.push(titleEl);
  }
  // If there are other elements (subheading, cta) in the content div, include them
  if (contentDiv) {
    Array.from(contentDiv.children).forEach(child => {
      if (child !== titleEl) {
        contentCell.push(child);
      }
    });
  }

  // Now construct the table rows according to block definition
  const rows = [];
  // 1. Header row (block name EXACT)
  rows.push(['Hero (hero6)']);
  // 2. Background image (optional)
  rows.push([imgEl ? imgEl : '']);
  // 3. Content (title, subheading, cta, all in one cell)
  rows.push([contentCell.length > 0 ? contentCell : '']);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
