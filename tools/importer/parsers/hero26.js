/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the direct child by class from parent
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Start extracting from the block
  const teaser = element.querySelector('.cmp-teaser');
  let imgEl = null;
  let contentEls = [];

  if (teaser) {
    // Find image
    const teaserImageWrap = getDirectChildByClass(teaser, 'cmp-teaser__image');
    if (teaserImageWrap) {
      // The cmp-image is inside that
      const cmpImg = teaserImageWrap.querySelector('.cmp-image');
      if (cmpImg) {
        const actualImg = cmpImg.querySelector('img');
        if (actualImg) {
          imgEl = actualImg;
        }
      }
    }

    // Find content
    const contentWrap = getDirectChildByClass(teaser, 'cmp-teaser__content');
    if (contentWrap) {
      // Title
      const title = contentWrap.querySelector('.cmp-teaser__title');
      if (title) {
        contentEls.push(title);
      }
      // Description (may be a div with p child, or other markup)
      const desc = contentWrap.querySelector('.cmp-teaser__description');
      if (desc) {
        // Push all children if possible, as array
        if (desc.children.length > 0) {
          contentEls.push(...Array.from(desc.children));
        } else if (desc.textContent.trim().length > 0) {
          // If no children but text, add the div
          contentEls.push(desc);
        }
      }
    }
  }

  // Header row is exactly as required
  const headerRow = ['Hero (hero26)'];
  // Image cell (row 2)
  const imageRow = [imgEl ? imgEl : ''];
  // Content cell (row 3)
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
