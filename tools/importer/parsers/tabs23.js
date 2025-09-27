/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements inside the tablist)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // Build rows: each row is [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label text
    const label = tabLabels[i].textContent.trim();

    // Tab content: use the full tabpanel content
    const panel = tabPanels[i];
    // Defensive: find the main content inside the panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find the main content article or div
    content = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    // Use the content as-is (do not clone, reference directly)
    rows.push([label, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabsRoot with the table
  tabsRoot.replaceWith(table);
}
