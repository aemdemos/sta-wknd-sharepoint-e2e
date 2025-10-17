/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  // Defensive: If not found, try to find by role
  let cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) cmpTabs = tabsContainer;
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (one per tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: first row is header
  const rows = [['Tabs (tabs13)']];

  // For each tab, build a row [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    // Defensive: If not found, skip
    if (!panel) return;
    // Extract the main content fragment/article inside the panel
    let content = panel.querySelector('article') || panel;
    // Defensive: If article not found, use panel itself
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block table
  tabsContainer.replaceWith(block);
}
