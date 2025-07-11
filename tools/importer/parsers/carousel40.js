/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual teaser block inside potential wrappers
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    teaser = teaser.querySelector('.cmp-teaser');
  }
  if (!teaser) return;

  // Extract the teaser image (mandatory)
  let imageCell = null;
  const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) imageCell = img;
  }

  // Extract text content for the right cell
  const contentDiv = teaser.querySelector('.cmp-teaser__content');
  const textContent = [];
  if (contentDiv) {
    // Use existing elements directly
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) textContent.push(pretitle);
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) textContent.push(title);
    const description = contentDiv.querySelector('.cmp-teaser__description');
    if (description && description.textContent.trim()) textContent.push(description);
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) textContent.push(cta);
  }
  // Compose the text cell: if only one element, just use it; if multiple, use array
  const textCell = textContent.length === 1 ? textContent[0] : (textContent.length > 1 ? textContent : '');

  // Build the cells array with correct structure: header = one cell, slide = two cells
  const cells = [];
  // Header row (one column only)
  cells.push(['Carousel (carousel40)']);
  // Slide row (two columns: image | text)
  cells.push([imageCell, textCell]);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
