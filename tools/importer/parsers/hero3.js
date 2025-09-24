/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block root (first cmp-teaser inside a cmp-container)
  const heroContainer = element.querySelector('.cmp-container .cmp-teaser');
  if (!heroContainer) return;

  // Get the image element (background image)
  let imageEl = null;
  const imageWrap = heroContainer.querySelector('.cmp-teaser__image [data-cmp-is="image"]');
  if (imageWrap) {
    imageEl = imageWrap.querySelector('img');
  }

  // Get all text content for the third row (title, subheading, CTA)
  const textContent = document.createElement('div');
  const contentWrap = heroContainer.querySelector('.cmp-teaser__content');
  if (contentWrap) {
    // Add all children (not just h2)
    Array.from(contentWrap.childNodes).forEach((node) => {
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        textContent.appendChild(node.cloneNode(true));
      }
    });
  }

  // Always include a third row for text, even if empty
  const headerRow = ['Hero (hero3)'];
  const imageRow = [imageEl ? imageEl.cloneNode(true) : ''];
  const textRow = [textContent.childNodes.length ? textContent : ''];

  // Ensure the table has exactly 3 rows: header, image, text
  const cells = [headerRow, imageRow, textRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
