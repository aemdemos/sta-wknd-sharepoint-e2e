/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, add a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Defensive: get the main contentfragment/article inside the panel
    let tabContent = null;
    // Prefer the contentfragment article, but fallback to panel itself
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsBlock with the new block table
  tabsBlock.replaceWith(block);
}
