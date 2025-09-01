/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tab list (li[role=tab])
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabItems.map(tab => tab.textContent.trim());

  // Get tab panels (div[role=tabpanel]) in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row: block name
  const headerRow = [ 'Tabs (tabs31)' ];
  const rows = [ headerRow ];

  // For each tab, gather label and content fragment (keep all HTML semantics)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // Prefer the article.cmp-contentfragment if present for semantic grouping
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // If not, use panel itself (all its children)
        tabContent = document.createElement('div');
        Array.from(panel.childNodes).forEach(node => {
          tabContent.appendChild(node);
        });
      }
    } else {
      tabContent = document.createTextNode('');
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace tabsBlock with the new block table
  tabsBlock.replaceWith(block);
}
