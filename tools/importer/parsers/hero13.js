/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero13)'];

  // 2. Background image row
  // Find the image element
  let imgEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imgEl = teaserImageDiv.querySelector('img');
  }

  const imageRow = [imgEl ? imgEl : ''];

  // 3. Content row (title, description, CTA)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let contentArr = [];
  if (contentDiv) {
    // Title
    const titleEl = contentDiv.querySelector('.cmp-teaser__title');
    if (titleEl) contentArr.push(titleEl);
    // Description
    const descEl = contentDiv.querySelector('.cmp-teaser__description');
    if (descEl) contentArr.push(descEl);
    // CTA
    const ctaContainer = contentDiv.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentArr.push(ctaLink);
    }
  }
  const contentRow = [contentArr.length ? contentArr : ''];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
