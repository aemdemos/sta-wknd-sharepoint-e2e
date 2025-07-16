/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements, direct children)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.children) : [];
  // Get tab panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanelEls = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  if (!tabLabelEls.length || !tabPanelEls.length) return;

  // Compose the header row (one column)
  const headerRow = ['Tabs (tabs14)'];
  // Compose the label row (tab labels in first row, each in one cell)
  const labelsRow = tabLabelEls.map(tab => tab.textContent.trim());

  // Compose tab content rows (each row: label, content)
  const tabRows = tabLabelEls.map((labelEl, idx) => {
    let panel = tabPanelEls[idx];
    if (!panel) panel = document.createElement('div');
    // Prefer .contentfragment if present, else panel
    const contentEl = panel.querySelector('.contentfragment') || panel;
    return [labelEl.textContent.trim(), contentEl];
  });

  // Compose the table data: header row (1 col), then each tab as [label, content]
  const cells = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
