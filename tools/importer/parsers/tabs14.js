/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs navigation (tab labels)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Make sure tabLabels and tabPanels are paired
  if (tabLabels.length !== tabPanels.length) {
    // If mismatch, only process up to the minimum length
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Table header row
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: If no panel, skip
    if (!panel) return;

    // Extract the main content fragment inside the panel
    // Usually one .contentfragment per panel
    const contentFragment = panel.querySelector('.contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the contentfragment element directly for resilience
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }

    // Create row: [Tab Label, Tab Content]
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
