/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs, [class*="tabs"]');
  if (!tabsRoot) return;

  // Find the cmp-tabs container (the actual tabs component)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab titles from the tablist
  const tabTitles = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure tabTitles and tabPanels match
  if (tabTitles.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row: always use the block name
  rows.push(['Tabs (tabs38)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabTitles.length; i++) {
    const label = tabTitles[i];
    const panel = tabPanels[i];

    // Defensive: clone the panel content to avoid moving it in the DOM
    // But we want to preserve references if possible, so we can use the panel directly
    // Remove tabpanel-specific attributes/classes for cleanliness
    const panelContent = document.createElement('div');
    // Copy all children from the tabpanel (not the tabpanel itself)
    Array.from(panel.childNodes).forEach(child => {
      panelContent.appendChild(child.cloneNode(true));
    });

    rows.push([label, panelContent]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
