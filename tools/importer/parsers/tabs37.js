/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabs) return;

  // Find the cmp-tabs container (the one with tablist and tabpanels)
  const cmpTabs = tabs.querySelector('.cmp-tabs') || tabs;
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row as per block guidelines
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Match panel by aria-controls
    let panel = tabPanels.find(p => label.getAttribute('aria-controls') === p.id);
    if (!panel) {
      // fallback: use order
      panel = tabPanels[i];
    }
    const tabName = label.textContent.trim();
    // Defensive: get the main content inside the tab panel
    let tabContent = null;
    // Prefer the contentfragment/article inside the panel
    tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    // Place both label and content in their cells
    rows.push([tabName, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabs.replaceWith(block);
}
