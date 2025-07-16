/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get a single element within a parent
  function safeQuery(parent, selector) {
    return parent ? parent.querySelector(selector) : null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero28)'];

  // 2. Background image row (can be empty if missing)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Content row (title, description, CTA)
  const contentEls = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Title (keep heading level as in original)
    const title = safeQuery(content, '.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      contentEls.push(title);
    }
    // Description
    const desc = safeQuery(content, '.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      // Ensure it's a paragraph element for clarity
      let para = desc;
      if (desc.tagName.toLowerCase() !== 'p') {
        para = document.createElement('p');
        para.innerHTML = desc.innerHTML;
      }
      contentEls.push(para);
    }
    // CTA
    const cta = safeQuery(content, '.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      contentEls.push(cta);
    }
  }

  const tableRows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEls.length ? contentEls : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
