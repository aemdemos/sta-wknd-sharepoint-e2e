/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly as in the example
  const cells = [['Carousel (carousel27)']];

  // Find the image for the slide
  let imageCell = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img; // reference existing <img>
    }
  }

  // Find the text content for the slide
  let textCell = null;
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // We will collect each content part as HTML elements and append in order
    const parts = [];
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim() !== '') {
      // Keep heading level as in source
      parts.push(title);
    }
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim() !== '') {
      parts.push(desc);
    }
    const action = content.querySelector('.cmp-teaser__action-link');
    if (action && action.textContent.trim() !== '') {
      // Insert a <p> containing the link, preserving the link element itself
      const p = document.createElement('p');
      p.appendChild(action);
      parts.push(p);
    }
    if (parts.length > 0) {
      textCell = parts;
    }
  }

  // Push the row only if at least one column has content
  if (imageCell || textCell) {
    cells.push([
      imageCell,
      textCell
    ]);
  }

  // Build the table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
