/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Header row as required
  const headerRow = ['Carousel (carousel39)'];

  // --- Slide Extraction ---
  // The structure is: element > ... > cmp-teaser__content (text), cmp-teaser__image (image)
  // Defensive: find cmp-teaser__image and cmp-teaser__content
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // --- Image cell ---
  // Find the actual image element inside cmp-teaser__image
  let imageCell = '';
  if (teaserImage) {
    // Look for <img> inside teaserImage
    const img = teaserImage.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // --- Text cell ---
  // Compose text cell: title (h2), description (div.cmp-teaser__description)
  let textCell = '';
  if (teaserContent) {
    // Gather title and description if present
    const parts = [];
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) parts.push(title);
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) parts.push(desc);
    if (parts.length) textCell = parts;
  }

  // Compose the slide row
  const slideRow = [imageCell, textCell];

  // Compose the table
  const tableCells = [headerRow, slideRow];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(table);
}
