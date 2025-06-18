/* global WebImporter */
export default function parse(element, { document }) {
  // Find the primary grid containing main/aside and image
  const mainGrids = element.querySelectorAll(':scope > div');
  let contentGrid = null;
  for (const grid of mainGrids) {
    if (grid.querySelector('main.container') && grid.querySelector('aside.container')) {
      contentGrid = grid;
      break;
    }
  }
  if (!contentGrid) return;

  // --- LEFT COLUMN: Hero image + main article content ---
  // Find the hero image (first .image in mainGrids, but outside main/aside)
  let heroImg = null;
  for (const grid of mainGrids) {
    const imgDiv = grid.querySelector('.image');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) {
        heroImg = img;
        break;
      }
    }
  }

  // Now, get the main content: titles and article (from main.container)
  const mainCol = contentGrid.querySelector('main.container');
  let mainContent = [];
  if (mainCol) {
    // Titles
    const titles = Array.from(mainCol.querySelectorAll(':scope > div.title'));
    // Article (contentfragment)
    const article = mainCol.querySelector('article.contentfragment');
    if (titles.length) mainContent.push(...titles);
    if (article) mainContent.push(article);
    // Experience Fragment/Byline (if present)
    const xf = mainCol.querySelector('.experiencefragment');
    if (xf) mainContent.push(xf);
  }
  // Compose left cell: hero image + all main column content
  const leftCell = heroImg ? [heroImg, ...mainContent] : mainContent;

  // --- RIGHT COLUMN: sidebar content only (just the inner sidebar, not <aside> itself) ---
  const sidebarCol = contentGrid.querySelector('aside.container');
  let rightCell = [];
  if (sidebarCol) {
    // Only include the immediate children of the sidebar, not the <aside> itself
    rightCell = Array.from(sidebarCol.children);
  }

  // Build the block table
  const headerRow = ['Columns (columns25)'];
  const cells = [headerRow, [leftCell, rightCell]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
