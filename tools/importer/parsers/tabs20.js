/* global WebImporter */
export default function parse(element, { document }) {
  // Find the WKND tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Find all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the header row (block name EXACTLY)
  const headerRow = ['Tabs (tabs20)'];
  const cells = [headerRow];

  // For each tab, add a row with [Label, Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Prefer referencing the .cmp-contentfragment__elements if present, else the main panel
      const contentFragment = panel.querySelector('.cmp-contentfragment');
      if (contentFragment) {
        const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
        if (cfElements) {
          tabContent = cfElements;
        } else {
          tabContent = contentFragment;
        }
      } else {
        tabContent = panel;
      }
    } else {
      // If missing, place an empty div
      tabContent = document.createElement('div');
    }
    cells.push([labelText, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
