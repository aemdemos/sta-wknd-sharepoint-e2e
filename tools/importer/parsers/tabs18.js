/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Get tab labels from the tablist
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Get each tabpanel (tab content)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the header row (block name only, one cell)
  const cells = [['Tabs (tabs18)']];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Use .contentfragment/article if present; else fallback to panel
      const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
      contentCell = contentFragment || panel;
    }
    cells.push([label, contentCell]);
  }

  // Create the block table and replace the tabs wrapper
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsWrapper.replaceWith(table);
}
