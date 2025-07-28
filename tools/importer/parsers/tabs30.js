/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (from tablist > li)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (in order, match to tabLabels)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: skip if no tabs or panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the rows for the table
  const tableRows = [];
  // Header row
  tableRows.push(['Tabs (tabs30)']);

  // For each tab, add a row: [Label, Content]
  tabLabels.forEach((tabLabel, i) => {
    // Get the text of the tab label
    const label = tabLabel.textContent.trim();
    // Get the associated tabpanel (may not be strictly index-based, but they match by order in this markup)
    const panel = tabPanels[i];
    if (!panel) return;
    // Reference the main content of tabpanel: usually a .contentfragment inside; if not, use the entire panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback to all children of the panel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => tabContent.appendChild(node));
    }
    tableRows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the tabsRoot with the new block table
  tabsRoot.replaceWith(block);
}
