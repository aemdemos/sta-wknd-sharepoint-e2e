/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header from block name EXACTLY as specified
  const headerRow = ['Hero (hero39)'];

  // Image row: find the hero image (background image in example)
  let imageEl = null;
  const imgContainer = element.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    // Only include <img>, not the wrapper
    imageEl = imgContainer.querySelector('img');
  }

  // Content row: heading, subheading, description, call-to-action
  const contentEls = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title (h2 is used in this HTML)
    const titleEl = contentContainer.querySelector('.cmp-teaser__title');
    if (titleEl) {
      contentEls.push(titleEl);
    }
    // Description (often a <p> inside a wrapper)
    const descContainer = contentContainer.querySelector('.cmp-teaser__description');
    if (descContainer) {
      // Grab all children (so future variations, e.g. multiple <p>, work)
      if (descContainer.children.length > 0) {
        for (const child of descContainer.children) {
          contentEls.push(child);
        }
      } else {
        // If no children, include the container itself (edge case)
        contentEls.push(descContainer);
      }
    }
  }
  // If nothing found, put empty string in cell
  const contentCell = contentEls.length ? contentEls : '';

  // Construct the table array as specified: 1 column, 3 rows
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentCell]
  ];

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
