/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (li[role=tab])
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? tabList.querySelectorAll('li[role="tab"]') : [];
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Get the tab panel elements (tab content)
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // Construct the block table
  const cells = [];
  // Header row matches example ('Tabs (tabs3)')
  cells.push(['Tabs (tabs3)']);

  // For each tab, create a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // The contentfragment is the main tab content, fallback: panel
      const contentFragment = panel.querySelector('.contentfragment') || panel;
      contentCell = contentFragment;
    } else {
      // Handle missing panel (shouldn't happen, but robust)
      contentCell = document.createElement('div');
    }
    cells.push([label, contentCell]);
  }
  // Create table and replace tabs block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
