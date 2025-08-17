/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (.cmp-tabs is the main block)
  let tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) {
    // If top-level element is .cmp-tabs itself, use it
    if (element.classList.contains('cmp-tabs')) {
      tabsEl = element;
    } else {
      return;
    }
  }

  // Get tab labels (from .cmp-tabs__tablist)
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (tabLabels.length === 0) return;

  // Get all tab panels (tabpanel role)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[role="tabpanel"]'));
  // If no tabPanels, exit
  if (tabPanels.length === 0) return;

  // There may be tabs with no content, so align by order
  // Panel order matches tab order (by convention)
  // Build the header row
  const headerRow = ['Tabs (tabs23)'];

  // Build the column header row: tab names as <strong> elements
  const columnHeaderRow = tabLabels.map(tab => {
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // Build the tab content row: each cell = contentfragment/article under tabpanel
  const contentRow = tabPanels.map(panel => {
    // Prefer cmp-contentfragment under panel
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      return cf;
    }
    // fallback: use all children of the panel
    // Collect all direct children (excluding empty grids)
    const validChildren = [];
    Array.from(panel.children).forEach(child => {
      // ignore empty grid wrappers
      if (
        child.classList &&
        child.classList.contains('aem-Grid') &&
        child.innerHTML.trim() === ''
      ) {
        return;
      }
      validChildren.push(child);
    });
    // If anything valid, use array, else panel itself
    if (validChildren.length > 0) {
      return validChildren.length === 1 ? validChildren[0] : validChildren;
    }
    return panel;
  });

  // Compose the table cells
  const cells = [headerRow, columnHeaderRow, contentRow];

  // Create table with WebImporter.DOMUtils.createTable
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the block table
  tabsEl.replaceWith(block);
}
