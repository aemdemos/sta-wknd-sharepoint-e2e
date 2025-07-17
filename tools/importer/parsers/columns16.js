/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns: main and sidebar
  // Those are <main class="container ..."> and <aside class="container ..."> inside the given element
  // Each's first .cmp-container child holds the relevant column content

  // Step 1: Identify the main and sidebar columns
  let mainCol, sideCol;
  for (const child of element.children) {
    if (
      child.tagName === 'MAIN' && child.classList.contains('container')
    ) {
      mainCol = child;
    } else if (
      child.tagName === 'ASIDE' && child.classList.contains('container')
    ) {
      sideCol = child;
    }
  }

  if (!mainCol || !sideCol) return;

  // Step 2: Retrieve their .cmp-container direct children (which hold the visible content)
  const mainCmp = mainCol.querySelector(':scope > .cmp-container');
  const sideCmp = sideCol.querySelector(':scope > .cmp-container');
  // Fallback - use column itself if cmp-container not found
  const mainContent = mainCmp ? Array.from(mainCmp.children) : Array.from(mainCol.children);
  const sideContent = sideCmp ? Array.from(sideCmp.children) : Array.from(sideCol.children);

  // Step 3: Build table as per block rules
  // Header row must be exactly: Columns (columns16)
  const cells = [
    ['Columns (columns16)'],
    [mainContent, sideContent],
  ];

  // Step 4: Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
