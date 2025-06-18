/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be exactly as in the example markdown
  const headerRow = ['Hero'];

  // Extract image element for the background image row
  let imageEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }

  // Compose the content cell: pretitle, title (as h1), description, CTA, in order, only if present
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentDiv) {
    // Pretitle (subtitle)
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      contentParts.push(pretitle);
    }
    // Title as h1 (convert h2 to h1 in-place, keep reference)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      contentParts.push(h1);
    }
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      contentParts.push(desc);
    }
    // CTA link
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentParts.push(cta);
    }
  }

  // Final table structure according to the example: 1 column, 3 rows
  const tableRows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentParts.length > 0 ? contentParts : '']
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  
  // No Section Metadata in the example, so just replace with the block
  element.replaceWith(block);
}
