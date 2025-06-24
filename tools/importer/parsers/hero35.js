/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the topmost hero image (decorative, banner-style, usually at the top)
  let mainImage = null;
  // Find the first .image block with an <img> tag
  const imageBlocks = element.querySelectorAll('.image');
  for (const block of imageBlocks) {
    const img = block.querySelector('img');
    if (img) {
      mainImage = img;
      break;
    }
  }

  // 2. Extract heading and subheading content and other relevant text content
  // We'll target the main content area: the first .container.responsivegrid with .aem-GridColumn--default--8
  let mainContentArea = null;
  const grids = element.querySelectorAll('main.container.responsivegrid');
  for (const grid of grids) {
    if (grid.classList.contains('aem-GridColumn--default--8')) {
      mainContentArea = grid;
      break;
    }
  }
  if (!mainContentArea) mainContentArea = element;

  // For hero content, collect all title and heading elements in expected order
  let heroContent = [];
  // Get all direct children of mainContentArea
  const mainContainer = mainContentArea.querySelector('.cmp-container');
  if (mainContainer) {
    // Find .cmp-title__text as headings (h1/h2/h3 etc)
    const headingEls = mainContainer.querySelectorAll('.cmp-title__text');
    headingEls.forEach((el) => heroContent.push(el));
  }

  // If nothing found, fallback to mainContentArea
  if (heroContent.length === 0) {
    const headingEls = mainContentArea.querySelectorAll('.cmp-title__text');
    headingEls.forEach((el) => heroContent.push(el));
  }

  // 3. Build the rows for the Hero block table
  // Row 1: Header (block name, exactly 'Hero')
  // Row 2: Image, or blank
  // Row 3: Heading and subheading, or blank
  const rows = [
    ['Hero'],
    [mainImage ? mainImage : ''],
    [heroContent.length > 0 ? heroContent : '']
  ];

  // 4. Create the Hero block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
