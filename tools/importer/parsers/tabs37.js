/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li[role=tab] under ol[role=tablist])
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tab panels (contents), order matters (should match tab order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Header row: single cell with the block name
  const rows = [['Tabs (tabs37)']];

  // For each tab, make a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Reference all children as an array, or the whole panel if no children
      if (panel.children.length === 1) {
        content = panel.children[0];
      } else if (panel.children.length > 1) {
        content = Array.from(panel.children);
      } else {
        content = panel.innerHTML ? (() => { const d = document.createElement('div'); d.innerHTML = panel.innerHTML; return d; })() : '';
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
