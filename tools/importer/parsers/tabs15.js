/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Build table rows: header row, then one row per tab
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // For each tab, add [label, content] row
  tabLabels.forEach((label, i) => {
    // Defensive: find the panel for this tab
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Find the contentfragment inside the panel
      const cf = panel.querySelector('.contentfragment');
      if (cf) {
        // Use the entire contentfragment as the tab content
        tabContent = cf;
      } else {
        // Fallback: use the panel itself
        tabContent = panel;
      }
    } else {
      // No panel found, fallback to empty string
      tabContent = '';
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
