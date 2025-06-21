/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in example
  const headerRow = ['Hero'];

  // Extract the image element, if present
  let imageEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }

  // Prepare the content for the third row
  const contentParts = [];
  // Pretitle as paragraph, if present
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  if (pretitle) {
    contentParts.push(pretitle);
  }
  // Title as h1, if present (convert tag if needed)
  const title = element.querySelector('.cmp-teaser__title');
  if (title) {
    let headingEl;
    if (title.tagName.toLowerCase() !== 'h1') {
      headingEl = document.createElement('h1');
      headingEl.innerHTML = title.innerHTML;
    } else {
      headingEl = title;
    }
    contentParts.push(headingEl);
  }
  // Description as paragraph, if present
  const desc = element.querySelector('.cmp-teaser__description');
  if (desc && desc.textContent.trim().length > 0) {
    const descP = document.createElement('p');
    descP.innerHTML = desc.innerHTML;
    contentParts.push(descP);
  }
  // CTA link, if present
  const cta = element.querySelector('.cmp-teaser__action-link');
  if (cta) {
    contentParts.push(cta);
  }

  // Compose the table cells as per the example (1 column, 3 rows)
  const cells = [
    headerRow,
    [imageEl || ''],
    [contentParts]
  ];
  
  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with new table
  element.replaceWith(table);
}
