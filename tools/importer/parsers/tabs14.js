/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tab navigation (tab labels)
  const tabNav = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;
  const tabLabels = Array.from(tabNav.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure number of labels matches number of panels
  if (tabLabels.length !== tabPanels.length) return;

  // Prepare table rows
  const rows = [];
  // Header row (block name)
  rows.push(['Tabs (tabs14)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: skip empty panels
    if (!panel) continue;

    // For tab content, use the entire contentfragment/article inside the panel
    // This is robust to structure changes and preserves all content
    const contentFragment = panel.querySelector('article') || panel;

    rows.push([label, contentFragment]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
