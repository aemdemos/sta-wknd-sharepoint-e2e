/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct children matching selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // Find the top aem-Grid inside the container (the grid holding the two columns)
  const topGrid = element.querySelector(':scope > div.cmp-container > div.aem-Grid');
  if (!topGrid) return;

  // Find the relevant two columns for the block (left sidebar, right main)
  // The left column is a <main> with adventure facts etc, the right is a div.tabs with the tabbed content.
  let leftCol = null, rightCol = null;

  for (const child of topGrid.children) {
    if (child.tagName === 'MAIN' && child.querySelector('article.cmp-contentfragment')) {
      leftCol = child;
    }
    if (child.classList.contains('tabs')) {
      rightCol = child;
    }
  }

  // If not found, fallback to selecting by class
  if (!leftCol) leftCol = topGrid.querySelector('main');
  if (!rightCol) rightCol = topGrid.querySelector('div.tabs');

  // LEFT COLUMN: collect adventure facts, share block, etc.
  let leftColContent = [];
  if (leftCol) {
    // Get column's inner grid (contains the facts CF, share title, and social links)
    const leftGrid = leftCol.querySelector('div.cmp-container > div.aem-Grid');
    if (leftGrid) {
      // Adventure facts (article.cmp-contentfragment)
      const facts = leftGrid.querySelector('article.cmp-contentfragment');
      if (facts) leftColContent.push(facts);
      // Share title (div.cmp-title)
      const shareTitle = leftGrid.querySelector('div.title .cmp-title');
      if (shareTitle) leftColContent.push(shareTitle);
      // Social sharing block
      const sharing = leftGrid.querySelector('div.sharing');
      if (sharing) leftColContent.push(sharing);
    }
  }

  // RIGHT COLUMN: the tabbed content for Overview, Itinerary, What to Bring
  let rightColContent = null;
  if (rightCol) {
    rightColContent = rightCol;
  }

  // If no relevant columns, don't do anything
  if (leftColContent.length === 0 && !rightColContent) return;

  // Table header: must match Columns (columns37)
  const headerRow = ['Columns (columns37)'];
  const contentRow = [leftColContent, rightColContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
