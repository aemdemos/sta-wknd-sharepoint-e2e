/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (actual tab container)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then each tab as a row [label, content]
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs29)']);

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Prefer the .contentfragment inside panel
    content = panel.querySelector('.contentfragment');
    if (!content) {
      // Fallback: use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
