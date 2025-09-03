/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only parse the main top-level container
  if (!element || !element.classList.contains('container')) return;

  // Find the main content column (left) and sidebar column (right)
  // There may be multiple .container children, so we need to find the main and aside
  const containers = Array.from(element.querySelectorAll(':scope > div > main.container, :scope > main.container, :scope > aside.container'));

  let mainContent = null;
  let sidebarContent = null;

  // Find main and aside containers
  containers.forEach((c) => {
    if (c.tagName === 'MAIN') {
      mainContent = c;
    } else if (c.tagName === 'ASIDE') {
      sidebarContent = c;
    }
  });

  // Fallback: If not found, try to find by class
  if (!mainContent) {
    mainContent = element.querySelector('main.container');
  }
  if (!sidebarContent) {
    sidebarContent = element.querySelector('aside.container');
  }

  // Defensive: If either column is missing, abort
  if (!mainContent || !sidebarContent) return;

  // --- COLUMN 1: Main Content ---
  // We'll grab all children of mainContent (except aside containers)
  // This will include the hero image, breadcrumb, titles, article, byline, etc.
  const mainColumnEls = Array.from(mainContent.children).filter((child) => child.tagName !== 'ASIDE');

  // --- COLUMN 2: Sidebar Content ---
  // We'll grab all children of sidebarContent
  const sidebarColumnEls = Array.from(sidebarContent.children);

  // --- TABLE STRUCTURE ---
  // Header row
  const headerRow = ['Columns (columns18)'];

  // Second row: two columns, left and right
  // Each cell is an array of elements
  const leftCell = mainColumnEls;
  const rightCell = sidebarColumnEls;

  // Build the table
  const cells = [
    headerRow,
    [leftCell, rightCell],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
