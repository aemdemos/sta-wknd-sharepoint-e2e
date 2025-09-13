/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !document) return;

  // Find the main content and sidebar containers
  const mainContainers = element.querySelectorAll(':scope > div > main.container');
  const asideContainers = element.querySelectorAll(':scope > div > aside.container');

  let mainContent, sidebarContent;
  if (mainContainers.length > 0) {
    mainContent = mainContainers[1] || mainContainers[0];
  } else {
    mainContent = element.querySelector('main.container');
  }
  if (asideContainers.length > 0) {
    sidebarContent = asideContainers[0];
  } else {
    sidebarContent = element.querySelector('aside.container');
  }
  if (!mainContent || !sidebarContent) return;

  // --- COLUMN 1: Main Article Content ---
  const mainCmpContainer = mainContent.querySelector('.cmp-container');
  let mainColumnContent = [];
  if (mainCmpContainer) {
    // Only get direct children except experiencefragment (author info)
    const mainChildren = Array.from(mainCmpContainer.children);
    const authorFragment = mainCmpContainer.querySelector('.experiencefragment');
    mainChildren.forEach(child => {
      if (child !== authorFragment) {
        mainColumnContent.push(child);
      }
    });
    if (authorFragment) {
      mainColumnContent.push(authorFragment);
    }
  } else {
    mainColumnContent = Array.from(mainContent.children);
  }

  // --- COLUMN 2: Sidebar Content ---
  const sidebarCmpContainer = sidebarContent.querySelector('.cmp-container');
  let sidebarColumnContent = [];
  if (sidebarCmpContainer) {
    sidebarColumnContent = Array.from(sidebarCmpContainer.children);
  } else {
    sidebarColumnContent = Array.from(sidebarContent.children);
  }

  // Only include sidebar column if it contains real content
  const sidebarHasContent = sidebarColumnContent.some(el => {
    return el.textContent.trim() || el.querySelector('img,a,button');
  });

  // --- Build the table ---
  const headerRow = ['Columns (columns9)'];
  // Always output two columns for this layout
  const contentRow = [mainColumnContent, sidebarColumnContent];
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
