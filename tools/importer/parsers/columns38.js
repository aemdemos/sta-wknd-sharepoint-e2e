/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract only meaningful content from a container
  function extractContent(container) {
    // Remove layout wrappers and keep only direct content blocks
    // Accepts: titles, images, articles, blockquotes, lists, download links, etc.
    const result = [];
    // Accept only direct children that are content (not layout wrappers)
    Array.from(container.children).forEach((child) => {
      // Skip grid/layout wrappers
      if (child.classList.contains('aem-Grid') || child.classList.contains('cmp-container')) return;
      // Accept content fragments, articles, images, titles, bylines, etc.
      if (
        child.classList.contains('title') ||
        child.classList.contains('image') ||
        child.classList.contains('contentfragment') ||
        child.classList.contains('experiencefragment') ||
        child.classList.contains('byline') ||
        child.classList.contains('buildingblock') ||
        child.classList.contains('breadcrumb') ||
        child.classList.contains('separator') ||
        child.classList.contains('download') ||
        child.classList.contains('list') ||
        child.classList.contains('sharing')
      ) {
        result.push(child);
      }
      // Accept <article> blocks
      if (child.tagName === 'ARTICLE') {
        result.push(child);
      }
    });
    // If nothing found, fallback to all children
    if (result.length === 0) {
      return Array.from(container.children);
    }
    return result;
  }

  // Find main and aside containers
  const mainContainer = element.querySelector('main.container');
  const asideContainer = element.querySelector('aside.container');

  // Extract content for columns
  let leftContent = [];
  let rightContent = [];
  if (mainContainer) {
    const mainDiv = mainContainer.querySelector('div.cmp-container');
    if (mainDiv) {
      leftContent = extractContent(mainDiv);
    } else {
      leftContent = extractContent(mainContainer);
    }
  }
  if (asideContainer) {
    const asideDiv = asideContainer.querySelector('div.cmp-container');
    if (asideDiv) {
      rightContent = extractContent(asideDiv);
    } else {
      rightContent = extractContent(asideContainer);
    }
  }

  // If no aside, only one column
  const headerRow = ['Columns (columns38)'];
  const columnsRow = [leftContent, rightContent.length ? rightContent : undefined].filter(Boolean);
  const tableRows = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
