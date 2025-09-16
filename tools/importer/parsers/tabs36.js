/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element if not already selected
  const cmpTabs = tabsRoot.classList.contains('cmp-tabs') ? tabsRoot : tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  tabList.querySelectorAll('[role="tab"]').forEach(tab => {
    tabLabels.push(tab.textContent.trim());
  });

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: tabLabels and tabPanels should match
  if (tabLabels.length !== tabPanels.length) {
    // Try to match by aria-controls/aria-labelledby
    // But for this structure, order should match
    // If not, just bail
    return;
  }

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs36)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: find the main content inside the tabpanel
    // Usually a .contentfragment or similar
    let content = null;
    // Prefer the first child that's not empty
    for (const child of panel.children) {
      if (child.childNodes.length > 0 || child.textContent.trim().length > 0) {
        content = child;
        break;
      }
    }
    // Fallback: use the panel itself
    if (!content) content = panel;
    rows.push([label, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
