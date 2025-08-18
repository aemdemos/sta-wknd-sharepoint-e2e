/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Hero (hero39)'];

  // Get all immediate children
  const children = element.querySelectorAll(':scope > div');
  let teaserDiv = null;
  children.forEach((div) => {
    if (div.classList.contains('cmp-teaser')) {
      teaserDiv = div;
    }
  });

  // Defensive: If teaserDiv is missing, use element itself
  if (!teaserDiv) {
    teaserDiv = element;
  }

  // From teaserDiv, extract content and image blocks
  let imageCell = '';
  let textCellContent = [];

  // Find cmp-teaser__image for image
  const imageDiv = teaserDiv.querySelector(':scope > .cmp-teaser__image');
  if (imageDiv) {
    const cmpImage = imageDiv.querySelector('[data-cmp-is="image"]');
    if (cmpImage) {
      const img = cmpImage.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
  }

  // Find cmp-teaser__content for text
  const contentDiv = teaserDiv.querySelector(':scope > .cmp-teaser__content');
  if (contentDiv) {
    // Title, description, other content
    Array.from(contentDiv.children).forEach((child) => {
      if (child.textContent && child.textContent.trim() !== '') {
        textCellContent.push(child);
      }
    });
  }

  // Fallback: if no text, try to pull direct text from teaserDiv
  if (textCellContent.length === 0) {
    Array.from(teaserDiv.children).forEach((child) => {
      if (child.textContent && child.textContent.trim() !== '') {
        textCellContent.push(child);
      }
    });
  }

  // The table: 3 rows, 1 column
  const cells = [
    headerRow,
    [imageCell],
    [textCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
