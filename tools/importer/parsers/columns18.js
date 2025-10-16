/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all main content nodes for left column, excluding any <aside>
  function getMainContent() {
    // Find main article area
    let mainArea = element.querySelector('main.container > div.cmp-container > main.container');
    if (!mainArea) {
      mainArea = element.querySelector('main.container > div.cmp-container');
    }
    if (!mainArea) {
      mainArea = element.querySelector('main.container .cmp-container');
    }
    // Remove any <aside> from mainArea
    if (mainArea) {
      const nodes = Array.from(mainArea.childNodes).filter(n => {
        if (n.nodeType === 3) return n.textContent.trim();
        if (n.nodeType === 1 && n.tagName === 'ASIDE') return false;
        return true;
      });
      // Remove any <aside> descendants from nodes
      return nodes.map(n => {
        if (n.nodeType === 1) {
          // Remove aside descendants
          const asides = n.querySelectorAll && n.querySelectorAll('aside');
          if (asides && asides.length) {
            asides.forEach(a => a.remove());
          }
        }
        return n;
      });
    }
    return null;
  }

  // Helper: get sidebar content for right column (only actual sidebar content)
  function getSidebarContent() {
    // Find sidebar container
    let sidebar = element.querySelector('aside.container > div.cmp-container');
    if (!sidebar) {
      sidebar = element.querySelector('aside.container .cmp-container');
    }
    // If found, return all children
    if (sidebar) {
      return Array.from(sidebar.childNodes).filter(n => {
        // Remove empty text nodes
        return n.nodeType !== 3 || n.textContent.trim();
      });
    }
    return null;
  }

  const headerRow = ['Columns (columns18)'];
  const row = [getMainContent(), getSidebarContent()];
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
