/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs component inside the element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Header row: one cell
  const cells = [['Tabs (tabs14)']];

  // Get the tab labels and panels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // For each tab, push a row: [label, content]
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i]?.textContent.trim() || '';
    let content = '';
    if (tabPanels[i]) {
      const cf = tabPanels[i].querySelector('.contentfragment');
      content = cf ? cf : tabPanels[i];
    }
    cells.push([label, content]);
  }

  // Create the table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(block);
}
