/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero39)'];

  // Get the background image (optional)
  let imageEl = null;
  const teaserImageContainer = element.querySelector('.cmp-teaser__image');
  if (teaserImageContainer) {
    // The .cmp-image might wrap the <img>
    const foundImg = teaserImageContainer.querySelector('img');
    if (foundImg) {
      imageEl = foundImg;
    }
  }

  // Get Title and Description (text content)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  let textContent = [];
  if (contentContainer) {
    // Get the title
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) {
      // Keep as the existing heading element to preserve semantic meaning
      textContent.push(title);
    }
    // Get the description (can have multiple paragraphs)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      // Use all children (usually <p>)
      Array.from(desc.children).forEach(child => {
        textContent.push(child);
      });
    }
  }

  // Build table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [textContent.length > 0 ? textContent : '']
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
