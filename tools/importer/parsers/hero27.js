/* global WebImporter */
export default function parse(element, { document }) {
  // 1. HEADER ROW: Must match exactly
  const headerRow = ['Hero (hero27)'];

  // 2. IMAGE (2nd row): should be the main hero image if present, or blank
  let bgImg = '';
  const imgContainer = element.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    const heroImg = imgContainer.querySelector('img');
    if (heroImg) bgImg = heroImg;
  }

  // 3. TEXT CONTENT (3rd row): Title, Subheading (description), CTA
  const contentNodes = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title (usually <h2>)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentNodes.push(title);
    // Description (usually <div>), convert to <p> if needed
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      if (desc.tagName.toLowerCase() === 'p') {
        contentNodes.push(desc);
      } else {
        const p = document.createElement('p');
        p.innerHTML = desc.innerHTML;
        contentNodes.push(p);
      }
    }
    // CTA link (optional)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) contentNodes.push(cta);
  }

  // Build the single-column, three-row table. No Section Metadata block as per example.
  const cells = [
    headerRow,
    [bgImg],
    [contentNodes]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
