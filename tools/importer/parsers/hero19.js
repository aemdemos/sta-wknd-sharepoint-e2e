/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Hero (hero19)'];

  // Get the hero image (background)
  let bgImg = '';
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) bgImg = img;
  }

  // Get the headline and description
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const textContent = [];
  if (contentContainer) {
    // Title (Heading)
    const h2 = contentContainer.querySelector('.cmp-teaser__title');
    if (h2) textContent.push(h2);

    // Description (could be single or multiple paragraphs)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      // All child nodes in description
      Array.from(desc.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
          textContent.push(node);
        }
      });
    }
  }

  // Create table: header, image, text
  const cells = [
    headerRow,
    [bgImg],
    [textContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
