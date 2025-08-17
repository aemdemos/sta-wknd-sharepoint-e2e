/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Hero (hero11)'];

  // Find the block with the hero content (teaser with image and text)
  // Find top-level .cmp-container children if present
  let heroContainer = null;
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));
  for (const div of topDivs) {
    // We want the first .cmp-container with a .cmp-teaser--hero child
    if (div.classList.contains('cmp-container') && div.querySelector('.cmp-teaser--hero')) {
      heroContainer = div.querySelector('.cmp-teaser--hero');
      break;
    }
  }
  // Fallback: search in whole element
  if (!heroContainer) {
    heroContainer = element.querySelector('.cmp-teaser--hero');
  }

  // Extract image (background image for the block, goes in row 2)
  let imageCell = '';
  if (heroContainer) {
    const imageDiv = heroContainer.querySelector('.cmp-teaser__image .cmp-image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
  }

  // Extract content (headline, optional subheading, cta — goes in row 3)
  let contentCellContents = [];
  if (heroContainer) {
    const contentDiv = heroContainer.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      // Title (usually an h2)
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) {
        contentCellContents.push(title);
      }
      // If there were a subheading or CTA, we would find and push them here as well.
    }
  }

  // If there is no content, provide empty string to keep cell structure
  if (contentCellContents.length === 0) {
    contentCellContents = [''];
  }

  // Compose rows for createTable
  const rows = [
    headerRow,                // Row 1: block name
    [imageCell],              // Row 2: background image (may be empty)
    [contentCellContents.length === 1 ? contentCellContents[0] : contentCellContents] // Row 3: text content
  ];

  // Create table block and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
