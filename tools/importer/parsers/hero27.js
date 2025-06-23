/* global WebImporter */
export default function parse(element, { document }) {
  // The "Hero" header, as in the example markdown (first row, as a single string)
  const headerRow = ['Hero'];

  // Get the background image (row 2)
  let img = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    img = teaserImageDiv.querySelector('img');
  }
  const imageRow = [img || ''];

  // Compose content cell (row 3): Heading, description, CTA
  const contentCell = [];
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Title (keep original heading tag)
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) contentCell.push(title);
    // Description (wrap in <p>)
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      // If already a <p>, use as is, else wrap in <p>
      if (desc.tagName.toLowerCase() === 'p') {
        contentCell.push(desc);
      } else {
        const p = document.createElement('p');
        p.innerHTML = desc.innerHTML;
        contentCell.push(p);
      }
    }
    // CTA (action-link), if present
    const cta = teaserContent.querySelector('.cmp-teaser__action-link');
    if (cta) contentCell.push(cta);
  }
  const contentRow = [contentCell];

  // Compose the block table as per the example: 1 col, 3 rows
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
