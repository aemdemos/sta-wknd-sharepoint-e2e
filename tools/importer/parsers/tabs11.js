/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element (contains tab navigation and panels)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (one per tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs11)']);

  // For each tab, create a row: [Tab Label, Tab Content]
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    // Defensive: skip if panel missing
    if (!panel) return;

    // Extract the full tab content block (preserve structure)
    // Usually there's a single .contentfragment inside
    let tabContent = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (!tabContent) {
      // Fallback: use all children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }

    // Add the row: [Tab Label, Tab Content]
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(block);
}
