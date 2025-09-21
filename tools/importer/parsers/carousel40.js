/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get image element (mandatory)
  let imageElem = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageElem = imageContainer.querySelector('img');
  }

  // Get text content (optional)
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let textElems = [];
  if (contentContainer) {
    // Pretitle (optional)
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textElems.push(pretitle);
    // Title (optional)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) textElems.push(title);
    // Description (optional)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) textElems.push(desc);
    // CTA (optional)
    const actionContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('a');
      if (cta) textElems.push(cta);
    }
  }

  // Build table rows
  const headerRow = ['Carousel (carousel40)'];
  const slideRow = [imageElem, textElems];
  const rows = [headerRow, slideRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
