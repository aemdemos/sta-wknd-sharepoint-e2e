/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label (as a div for semantic clarity)
    const labelDiv = document.createElement('div');
    labelDiv.textContent = tabLabels[i].textContent.trim();

    // Tab content: reference the entire tabpanel content
    // Use the .contentfragment inside the tabpanel if present, else the tabpanel itself
    const panelContent = tabPanels[i];
    const contentFragment = panelContent.querySelector('.contentfragment') || panelContent;

    rows.push([labelDiv, contentFragment]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
