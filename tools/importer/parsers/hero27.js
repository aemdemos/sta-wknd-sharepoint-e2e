/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct children by class
  function findDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Image row (background image)
  let imageEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl.cloneNode(true) : ''];

  // 3. Content row (title, description, CTA)
  const teaserContentDiv = element.querySelector('.cmp-teaser__content');
  const contentEls = [];
  if (teaserContentDiv) {
    // Title
    const titleEl = teaserContentDiv.querySelector('.cmp-teaser__title');
    if (titleEl) {
      const h2 = document.createElement('h2');
      h2.textContent = titleEl.textContent.trim();
      contentEls.push(h2);
    }
    // Description
    const descEl = teaserContentDiv.querySelector('.cmp-teaser__description');
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      contentEls.push(p);
    }
    // CTA
    const actionLink = teaserContentDiv.querySelector('.cmp-teaser__action-link');
    if (actionLink) {
      const a = document.createElement('a');
      a.href = actionLink.href;
      a.textContent = actionLink.textContent.trim();
      contentEls.push(a);
    }
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
