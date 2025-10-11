/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must use target block name exactly
  const headerRow = ['Hero (hero38)'];

  // 2. Image row: reference the actual <img> element (not URL or alt text)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Content row: heading, subheading, CTA (if present)
  const contentParts = [];
  // Heading: preserve semantic level
  const headingEl = element.querySelector('.cmp-teaser__title');
  if (headingEl) {
    contentParts.push(headingEl);
  }
  // Subheading/description: preserve formatting, only push actual content
  const descContainer = element.querySelector('.cmp-teaser__description');
  if (descContainer) {
    Array.from(descContainer.childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        contentParts.push(node);
      }
    });
  }
  // CTA: look for anchor tags inside the block
  const ctaEl = element.querySelector('a');
  if (ctaEl) {
    contentParts.push(ctaEl);
  }

  // Edge case: if no image, cell is empty string
  // If no content, cell is empty string
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentParts.length ? contentParts : ''],
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
