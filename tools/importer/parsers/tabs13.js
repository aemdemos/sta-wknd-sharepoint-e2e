/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block in the given element
  // The block root must have class 'cmp-tabs' (tabsBlock)
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist (ordered list of <li>)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels, which must match order of tab labels
  // Each panel has data-cmp-hook-tabs="tabpanel"
  const tabPanels = [];
  const panels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  for (let i = 0; i < panels.length; i++) {
    // For each tab panel, grab the content fragment article if available, otherwise the panel itself
    const panel = panels[i];
    let content = null;
    // If there is an article.cmp-contentfragment inside, use it
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: use panel's first meaningful child or the panel itself
      // This fallback is defensive, but for current HTML, contentFragment always exists
      content = panel;
    }
    tabPanels.push(content);
  }

  // Build table rows: header, then one row per tab (label, content)
  const headerRow = ['Tabs (tabs13)'];
  const tableRows = [headerRow];
  // For each label/panel, make a [label, content] row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    const content = tabPanels[i] || '';
    tableRows.push([label, content]);
  }

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  tabsBlock.replaceWith(table);
}
