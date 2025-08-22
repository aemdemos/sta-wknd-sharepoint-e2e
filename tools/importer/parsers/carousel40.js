/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly as example
  const headerRow = ['Carousel (carousel40)'];

  // Find the teaser content and image
  const content = element.querySelector('.cmp-teaser__content');
  const imageWrap = element.querySelector('.cmp-teaser__image');

  // Find image element (reference existing, do not clone)
  let imageEl = null;
  if (imageWrap) {
    imageEl = imageWrap.querySelector('img');
  }

  // Compose text content for the second cell
  const textContent = [];
  if (content) {
    // Optional pretitle
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textContent.push(pretitle);

    // Title
    const title = content.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);

    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) textContent.push(desc);

    // Call to Action link
    const link = content.querySelector('.cmp-teaser__action-link');
    if (link) textContent.push(link);
  }

  // Only add the row if there is an image (carousel slide always has image)
  const rows = [];
  if (imageEl) {
    // If textContent is empty, use empty string
    rows.push([
      imageEl,
      textContent.length > 0 ? textContent : ''
    ]);
  }

  // Build the table as per the example structure
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
