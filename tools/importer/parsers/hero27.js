/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must match the block name exactly)
  const headerRow = ['Hero (hero27)'];

  // Row 2: Background image (optional)
  // Find the FIRST <img> element within the element (this is the hero image)
  let imageEl = element.querySelector('img');
  const imageRow = [imageEl || '']; // If image is missing, stay resilient

  // Row 3: Title, Subheading, CTA (optional)
  // We want to capture the existing structure for resilience, but only the content section
  // Accept the entire cmp-teaser__content block
  let contentDiv = element.querySelector('.cmp-teaser__content');
  const textRow = [contentDiv || ''];

  // Compose the block table
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
