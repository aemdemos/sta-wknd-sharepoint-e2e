/* global WebImporter */
export default function parse(element, { document }) {
  // === Carousel (carousel40) block ===
  // 1. Header row as per example
  const headerRow = ['Carousel (carousel40)'];

  // 2. Extract image from the teaser block
  // The image is always required as first cell
  const imageContainer = element.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Extract text content for the second cell
  const textEls = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Pretitle
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textEls.push(pretitle);
    }
    // Title
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textEls.push(title);
    }
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textEls.push(desc);
    }
    // CTA/link (may be absent)
    const actionContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const actionLink = actionContainer.querySelector('.cmp-teaser__action-link');
      if (actionLink) {
        textEls.push(actionLink);
      }
    }
  }
  // If no text content, keep as empty array to ensure semantic meaning

  // 4. Compose the slide row
  // Always two cells: image | text content (may be empty array if nothing found)
  const slideRow = [imageEl, textEls];

  // 5. Construct the block table
  const cells = [headerRow, slideRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the block
  element.replaceWith(block);
}
