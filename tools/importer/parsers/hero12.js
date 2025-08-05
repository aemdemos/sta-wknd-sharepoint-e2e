/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser element
  let teaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the background image (img element), if present
  let imgEl = null;
  const imageDiv = teaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageDiv) {
    imgEl = imageDiv.querySelector('img');
  }

  // Get the title and any text content (subheading, CTA, etc.)
  let textContentArr = [];
  const contentDiv = teaser.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Only include non-empty nodes (element or text)
    textContentArr = Array.from(contentDiv.childNodes).filter(n => {
      if (n.nodeType === 1) return true; // Element
      if (n.nodeType === 3 && n.textContent.trim() !== '') return true; // Non-empty text
      return false;
    });
  }

  // Construct the block table as per block requirements
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imgEl ? imgEl : ''];
  const textRow = [textContentArr.length ? textContentArr : ''];

  const cells = [headerRow, imageRow, textRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
