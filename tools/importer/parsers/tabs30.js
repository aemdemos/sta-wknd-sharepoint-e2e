/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the actual tabs container (for navigation and panels)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;
  if (!cmpTabs) return;

  // Tab labels (navigation)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: If labels and panels mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs30)']);

  // For each tab, extract label and content
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    // Defensive: skip if panel missing
    if (!panel) return;

    // Extract the main content fragment inside the panel
    const cf = panel.querySelector('.cmp-contentfragment');
    let tabContent = null;
    if (cf) {
      // Use the contentfragment as the tab content
      tabContent = cf;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    // Defensive: clone the element to avoid moving it from DOM
    const tabContentClone = tabContent.cloneNode(true);
    rows.push([label, tabContentClone]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
