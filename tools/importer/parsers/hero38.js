/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the teaser content and image blocks
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the image element (background image)
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Get the teaser content (title and description)
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentWrapper) {
    // Title (h2)
    const titleEl = contentWrapper.querySelector('.cmp-teaser__title');
    if (titleEl) contentEls.push(titleEl);
    // Description (div > p)
    const descWrapper = contentWrapper.querySelector('.cmp-teaser__description');
    if (descWrapper) {
      // Defensive: grab all children (usually just <p>)
      Array.from(descWrapper.childNodes).forEach((node) => {
        if (node.nodeType === 1 /* ELEMENT_NODE */ || node.nodeType === 3 /* TEXT_NODE */) {
          contentEls.push(node);
        }
      });
    }
  }

  // Build the table rows
  const headerRow = ['Hero (hero38)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length > 0 ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
