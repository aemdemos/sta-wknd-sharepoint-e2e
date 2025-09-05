/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate children of a container
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Find the main content area (the main column)
  const mainColumn = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  // Find the sidebar area (the aside column)
  const sidebarColumn = element.querySelector('aside.container.responsivegrid.cmp-layoutcontainer--sidebar');

  // Defensive: If not found, fallback to first/second child
  let mainContent = mainColumn;
  let sidebarContent = sidebarColumn;
  if (!mainContent || !sidebarContent) {
    const containers = element.querySelectorAll(':scope > div');
    mainContent = containers[0] || null;
    sidebarContent = containers[1] || null;
  }

  // Compose the main column content
  const mainParts = [];
  if (mainContent) {
    // Title and author
    const titleEls = getDirectChildrenByClass(mainContent, 'title');
    mainParts.push(...titleEls);
    // Main article
    const article = mainContent.querySelector('article.contentfragment');
    if (article) mainParts.push(article);
    // Byline block (author image, name, social)
    const experienceFragment = mainContent.querySelector('.experiencefragment');
    if (experienceFragment) mainParts.push(experienceFragment);
  }

  // Compose the sidebar column content
  const sidebarParts = [];
  if (sidebarContent) {
    // All direct children (title, sharing, list)
    sidebarParts.push(...sidebarContent.children);
  }

  // Table header
  const headerRow = ['Columns (columns35)'];
  // Table content row: [main column, sidebar column]
  const contentRow = [mainParts, sidebarParts];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
