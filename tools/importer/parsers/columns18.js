/* global WebImporter */
export default function parse(element, { document }) {
  // The block header must match the spec
  const headerRow = ['Columns (columns18)'];

  // Find the content grid: first .cmp-container > .aem-Grid or .aem-Grid in main
  let grid = element.querySelector(':scope > .cmp-container > .aem-Grid');
  if (!grid) grid = element.querySelector('.aem-Grid');
  if (!grid) grid = element;

  // Left column: first large hero image (the first .image .cmp-image in the grid)
  let leftColImage = null;
  const images = grid.querySelectorAll('.image .cmp-image');
  if (images.length > 0) {
    leftColImage = images[0];
  }

  // Right column: all main content (titles, contentfragment, experiencefragment)
  // We want to preserve the semantic structure and reference existing elements
  const rightCol = document.createElement('div');

  // Try to find the main <main> under the grid which has all content
  let mainContent = grid.querySelector('main.container');
  if (!mainContent) {
    // fallback: .cmp-container with .contentfragment
    const contentContainers = grid.querySelectorAll('.cmp-container');
    for (const c of contentContainers) {
      if (c.querySelector('article.contentfragment')) {
        mainContent = c;
        break;
      }
    }
  }

  if (mainContent) {
    // Extract and add all top-level children in order except for possible containers with .aem-Grid (sidebar)
    // We want to include: 2 .title blocks, 1 .contentfragment block, and .experiencefragment if present
    const children = Array.from(mainContent.children);
    for (const child of children) {
      // Exclude empty containers or layout containers
      if (child.classList.contains('cmp-container') && !child.querySelector('article.contentfragment')) continue;
      rightCol.appendChild(child);
    }
  }
  // Attach experiencefragment block if present (byline)
  const experiencefragment = grid.querySelector('.experiencefragment');
  if (experiencefragment) {
    rightCol.appendChild(experiencefragment);
  }

  // Compose the block cells, 2 columns as in the example
  const cells = [
    headerRow,
    [leftColImage, rightCol]
  ];

  // Create the block table with WebImporter
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
