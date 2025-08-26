/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (should be .tabs.panelcontainer)
  let tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the actual .cmp-tabs inside
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Extract tab panels (content)
  // Only get direct children with role="tabpanel"
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"].cmp-tabs__tabpanel'));
  // Defensive: If number of panels mismatch labels, do not continue
  if (tabLabels.length !== tabPanels.length) return;

  // Compose table header row (exact text, no extra text)
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // Each row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label text
    const label = tabLabels[i].textContent.trim();
    // Tab content panel reference
    // Reference the panel element directly, do not clone
    rows.push([label, tabPanels[i]]);
  }

  // Create the block table using DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
