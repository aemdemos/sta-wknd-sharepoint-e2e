/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element.closest('.tabs.panelcontainer') || element;
  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Compose rows: header, then one row per tab (label, content)
  const rows = [];
  // Always use the required block name as header
  rows.push(['Tabs (tabs37)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: find the main content inside the panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find a main content block (e.g. .contentfragment)
    content = panel.querySelector('.contentfragment') || panel;
    rows.push([
      label,
      content
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
