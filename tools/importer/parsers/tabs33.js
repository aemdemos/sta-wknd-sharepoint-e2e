/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element (the tabs block)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels as displayed in the tab headers (in order)
  const labelNodes = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  const tabLabels = labelNodes.map(li => li.textContent.trim());

  // Get all tabpanel elements in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  
  // Defensive: ensure number of labels matches number of panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build block table rows: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const tabpanel = tabPanels[i];
    if (!label || !tabpanel) continue; // skip empty
    // Reference the main content inside the tab
    // Use the article if present, else the tabpanel itself
    let contentEl = tabpanel.querySelector('article');
    if (!contentEl) contentEl = tabpanel;
    rows.push([label, contentEl]);
  }

  // Table header as in the example
  const header = ['Tabs (tabs33)'];
  const cells = [header, ...rows];
  
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block element with the new table
  tabsRoot.replaceWith(table);
}
