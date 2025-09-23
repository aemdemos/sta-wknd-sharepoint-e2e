/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find cmp-tabs
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get all tab panels (in order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Always use the required header row
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the contentfragment/article in the panel
    let contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the .cmp-contentfragment__elements if present, else the article
      const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Use the actual referenced element, not a clone
        tabContent = elements;
      } else {
        tabContent = contentFragment;
      }
    } else {
      tabContent = panel;
    }

    // Always reference the actual element, not clone or create new
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the block table
  tabsBlock.replaceWith(block);
}
