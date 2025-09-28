/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser container
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get image element (mandatory for carousel)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Get text content elements
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let textContent = [];
  if (contentContainer) {
    // Optional pretitle
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textContent.push(pretitle);

    // Optional title (as heading)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);

    // Optional description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) textContent.push(desc);

    // Optional CTA (link)
    const actionContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('a');
      if (cta) textContent.push(cta);
    }
  }

  // Build table rows
  const headerRow = ['Carousel (carousel40)'];
  const slideRow = [imageEl, textContent];
  const cells = [headerRow, slideRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
