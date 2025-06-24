/* global WebImporter */
export default function parse(element, { document }) {
  // Extract teaser image element (first img in .cmp-teaser__image)
  const imageColDiv = element.querySelector('.cmp-teaser__image');
  let imageEl = '';
  if (imageColDiv) {
    const img = imageColDiv.querySelector('img');
    if (img) imageEl = img;
  }

  // Extract content elements for the content column (pretitle, title, description, cta if present)
  const contentColDiv = element.querySelector('.cmp-teaser__content');
  const contentElements = [];
  if (contentColDiv) {
    // Pretitle
    const pretitle = contentColDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) contentElements.push(pretitle);
    // Title
    const title = contentColDiv.querySelector('.cmp-teaser__title');
    if (title) contentElements.push(title);
    // Description
    const description = contentColDiv.querySelector('.cmp-teaser__description');
    if (description) contentElements.push(description);
    // CTA(s)
    const ctas = contentColDiv.querySelectorAll('.cmp-teaser__action-link');
    ctas.forEach(cta => contentElements.push(cta));
  }

  // Build the Columns table: Header row, then 2-column row
  const rows = [
    ['Columns (columns20)'],
    [contentElements, imageEl]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
