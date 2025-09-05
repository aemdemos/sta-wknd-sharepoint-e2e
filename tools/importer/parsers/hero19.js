/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image element
  let imageEl = null;
  const imageContainer = Array.from(element.querySelectorAll(':scope > div .cmp-teaser__image, :scope > .cmp-teaser__image')).find(Boolean);
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Defensive: Find the content container
  let contentEl = null;
  const contentContainer = Array.from(element.querySelectorAll(':scope > div .cmp-teaser__content, :scope > .cmp-teaser__content')).find(Boolean);
  if (contentContainer) {
    // We'll collect all heading and description elements inside content
    const contentParts = [];
    // Heading
    const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentParts.push(heading);
    // Description (may be a div or p)
    const desc = contentContainer.querySelector('.cmp-teaser__description, p');
    if (desc) contentParts.push(desc);
    // Compose a wrapper for all content parts
    if (contentParts.length > 0) {
      const wrapper = document.createElement('div');
      contentParts.forEach(part => wrapper.appendChild(part));
      contentEl = wrapper;
    }
  }

  // Table header
  const headerRow = ['Hero (hero19)'];
  // Table rows
  const rows = [headerRow];
  // Image row
  rows.push([imageEl ? imageEl : '']);
  // Content row
  rows.push([contentEl ? contentEl : '']);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
