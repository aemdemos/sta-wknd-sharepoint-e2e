/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero18)'];

  // 2. Image row (background image)
  let imageEl = null;
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    const teaserImage = getDirectChildByClass(teaser, 'cmp-teaser__image');
    if (teaserImage) {
      // Look for an <img> inside
      imageEl = teaserImage.querySelector('img');
    }
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row (title, description, CTA)
  let contentFragments = [];
  if (teaser) {
    const content = getDirectChildByClass(teaser, 'cmp-teaser__content');
    if (content) {
      // Title
      const title = content.querySelector('.cmp-teaser__title');
      if (title) contentFragments.push(title);
      // Description
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) contentFragments.push(desc);
      // CTA: Not present in this sample, but future-proof
      const cta = content.querySelector('a');
      if (cta) contentFragments.push(cta);
    }
  }
  const contentRow = [contentFragments.length ? contentFragments : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
