/* global WebImporter */
export default function parse(element, { document }) {
  // The header row as required by the spec and example
  const headerRow = ['Carousel (carousel27)'];

  // The HTML provided contains only one slide wrapped in a .cmp-teaser element
  // The image is inside .cmp-teaser__image img
  // The text content (title, description, CTA) is inside .cmp-teaser__content

  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');

  // Defensive: only continue if teaser exists
  if (!teaser) {
    return;
  }

  // Image extraction (first column)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    // Only extract the <img> inside
    const img = imageContainer.querySelector('img');
    if (img) imageEl = img;
  }

  // Text content extraction (second column)
  const textContent = [];
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title: keep as heading if present
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) {
      textContent.push(title);
    }
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      textContent.push(desc);
    }
    // CTA link (if present)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textContent.push(cta);
    }
  }
  // Ensure at least an empty string if no text content so the table structure remains correct
  const slideRow = [imageEl || '', textContent.length ? textContent : ''];

  // Compose the cells as per the block structure: header row, then slide(s)
  const cells = [headerRow, slideRow];

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
