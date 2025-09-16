/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the content area inside the contentfragment
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get all direct children of cfElements
  const children = Array.from(cfElements.children);

  // Find the intro paragraph (first <p>) and skip it
  let idx = 0;
  while (idx < children.length && children[idx].tagName.toLowerCase() !== 'p') idx++;
  idx++; // skip intro

  // Prepare rows array, start with header
  const rows = [];
  rows.push(['Cards (cards16)']);

  // Now, loop through the rest to find cards
  while (idx < children.length) {
    // Each card starts with an h2
    while (idx < children.length && children[idx].tagName.toLowerCase() !== 'h2') idx++;
    if (idx >= children.length) break;
    const h2 = children[idx];
    idx++;

    // Next, find the image div (may be empty grid)
    let imageCell = '';
    let lookahead = idx;
    while (lookahead < children.length && children[lookahead].tagName.toLowerCase() === 'div') {
      const cmpImage = children[lookahead].querySelector('.cmp-image');
      if (cmpImage) {
        imageCell = cmpImage.cloneNode(true);
        lookahead++;
        break;
      }
      lookahead++;
    }
    idx = lookahead;

    // Next, find the description paragraph
    let desc = null;
    if (idx < children.length && children[idx].tagName.toLowerCase() === 'p') {
      desc = children[idx].cloneNode(true);
      idx++;
    }

    // Skip any empty grid divs after description
    while (idx < children.length && children[idx].tagName.toLowerCase() === 'div' && !children[idx].querySelector('.cmp-image')) {
      idx++;
    }

    // Build text cell: h2 + desc
    const textCell = [];
    if (h2) textCell.push(h2.cloneNode(true));
    if (desc) textCell.push(desc);
    // Only add row if we have at least an image and text
    if (imageCell && textCell.length) {
      rows.push([imageCell, textCell]);
    }
  }

  // Only create table if there are data rows
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
