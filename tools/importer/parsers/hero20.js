/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero20)'];

  // Find hero image
  let imageDiv = element.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Find content: title, description, CTA
  let contentDiv = element.querySelector('.cmp-teaser__content');
  let contentParts = [];
  if (contentDiv) {
    // Title (as heading)
    let title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) {
      // Use the original heading element if present, else fallback to h2
      let headingTag = /^H[1-6]$/.test(title.tagName) ? title : null;
      if (!headingTag) {
        const h2 = document.createElement('h2');
        h2.textContent = title.textContent.trim();
        headingTag = h2;
      }
      contentParts.push(headingTag);
    }
    // Description
    let desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      // Use the original div if it's styled as a paragraph, else wrap in <p>
      let para = desc;
      if (desc.tagName !== 'P') {
        para = document.createElement('p');
        para.textContent = desc.textContent.trim();
      }
      contentParts.push(para);
    }
    // CTA link
    let cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentParts.push(cta);
    }
  }

  // Table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentParts]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
