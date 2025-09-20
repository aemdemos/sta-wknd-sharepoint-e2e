/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get tab panels (order matters)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Build header row (block name as required)
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, build a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, i) => {
    const labelText = tabLabel.textContent.trim();
    const panel = tabPanels[i];
    if (!panel) return;
    // Use the panel element directly for content (retains all HTML and references)
    rows.push([labelText, panel]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the block table
  tabsBlock.replaceWith(block);
}
