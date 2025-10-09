/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the actual tabs component
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: first row is header
  const rows = [['Tabs (tabs36)']];

  // Each tab: label in first cell, content in second cell
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    // Defensive: Find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.contentfragment');
    if (!contentFragment) {
      // fallback: use panel itself
      contentFragment = panel;
    }
    rows.push([label, contentFragment]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original tabs block with the new table
  tabsRoot.replaceWith(block);
}
