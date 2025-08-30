/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  const labels = tabItems.map(tab => tab.textContent.trim());

  // Get the tab panels in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // For each tab, extract label and content
  const tabRows = tabPanels.map((panel, idx) => {
    // Tab label
    const label = labels[idx] || '';
    // Tab content: Reference all children of panel except empty .aem-Grid wrappers
    let contentEls = [];
    // Prefer the main article/contentfragment inside the panel
    const fragment = panel.querySelector('article');
    if (fragment) {
      contentEls.push(fragment);
    } else {
      // fallback: all non-empty direct children
      contentEls = Array.from(panel.children).filter(child => {
        if (child.classList.contains('aem-Grid')) return false;
        if (child.textContent.trim() === '' && child.querySelectorAll('img,ul,ol,table,iframe,video').length === 0) return false;
        return true;
      });
      if (contentEls.length === 0) contentEls = [panel];
    }
    return [label, contentEls.length === 1 ? contentEls[0] : contentEls];
  });

  // Compose the block table
  const headerRow = ['Tabs (tabs19)'];
  const tableArr = [headerRow, ...tabRows];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableArr, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
