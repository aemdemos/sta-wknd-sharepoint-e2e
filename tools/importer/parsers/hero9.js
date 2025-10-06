/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList && el.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero9)'];

  // 2. Background image row
  // Find the image element
  let imgEl = null;
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    const teaserImage = getDirectChildByClass(teaser, 'cmp-teaser__image');
    if (teaserImage) {
      // Look for <img> inside
      imgEl = teaserImage.querySelector('img');
    }
  }
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Content row (title, description, CTA)
  let contentEls = [];
  if (teaser) {
    const teaserContent = getDirectChildByClass(teaser, 'cmp-teaser__content');
    if (teaserContent) {
      // Title
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl) contentEls.push(titleEl);
      // Description
      const descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) contentEls.push(descEl);
      // CTA: not present in this example, but if there is a link, include it
      const ctaEl = teaserContent.querySelector('a');
      if (ctaEl) contentEls.push(ctaEl);
    }
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
