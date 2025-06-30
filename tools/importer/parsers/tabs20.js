/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Create the header row: exactly one column with the text 'Tabs (tabs20)'
  const headerRow = ['Tabs (tabs20)'];

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels in DOM order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Each row after the header is [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    let contentElem = '';
    if (tabPanels[i]) {
      // Reference the existing DOM node directly
      contentElem = tabPanels[i];
    }
    rows.push([label, contentElem]);
  }

  // Build the table rows array
  const cells = [headerRow, ...rows];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
