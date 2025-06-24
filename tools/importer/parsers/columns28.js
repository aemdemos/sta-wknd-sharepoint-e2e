/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Top-level: left (main content) and right (main image + sidebar)

  // Find main hero image (right column)
  let heroImage = null;
  const grid = element.querySelector(':scope > .cmp-container > .aem-Grid');
  if (grid) {
    heroImage = grid.querySelector(':scope > .image .cmp-image');
  }
  if (!heroImage) {
    heroImage = element.querySelector('.cmp-image');
  }

  // Find the main content area (the 8-column main section)
  let mainContent = null;
  const mainCandidates = element.querySelectorAll('main.container');
  for (const candidate of mainCandidates) {
    if (candidate.querySelector('.cmp-contentfragment')) {
      mainContent = candidate;
      break;
    }
  }

  // Find the breadcrumb
  const breadcrumb = element.querySelector('.breadcrumb');
  // Find all main titles
  let titles = [];
  if (mainContent) {
    titles = Array.from(mainContent.querySelectorAll(':scope > .cmp-container > .title'));
  }
  // Find the article/contentfragment block
  let article = null;
  if (mainContent) {
    article = mainContent.querySelector('.cmp-contentfragment');
  }
  // Byline/experiencefragment
  const byline = element.querySelector('.experiencefragment');

  // Find the sidebar (the <aside>)
  const aside = element.querySelector('aside.container');
  let sidebar = null;
  if (aside) {
    sidebar = aside.querySelector(':scope > .cmp-container > .aem-Grid');
  }

  // Compose left column: breadcrumb, titles, article, byline (in order)
  let leftColumn = [];
  if (breadcrumb) leftColumn.push(breadcrumb);
  leftColumn = leftColumn.concat(titles);
  if (article) leftColumn.push(article);
  if (byline) leftColumn.push(byline);

  // Compose right column: hero image (if any), sidebar (if any)
  let rightColumn = [];
  if (heroImage) rightColumn.push(heroImage);
  if (sidebar) rightColumn.push(sidebar);

  // --- FIX: Structure must be TWO rows ---
  // [[header],[left, right]] instead of [[header, left, right]]
  const cells = [
    ['Columns (columns28)'], // header row, 1 column
    [leftColumn, rightColumn] // content row, 2 columns
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
