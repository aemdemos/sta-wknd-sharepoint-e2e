/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the supplied element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // The tab labels are in the <li> elements inside the <ol> with class cmp-tabs__tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // The tab panels are the .cmp-tabs__tabpanel elements; their order matches tabLabels
  const tabPanelEls = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row: single cell, matching markdown example (block name only)
  const headerRow = ['Tabs (tabs22)'];
  // Each tab row: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, index) => {
    const tabPanel = tabPanelEls[index];
    let content;
    if (tabPanel) {
      // Use the first .contentfragment if present, fallback to tabPanel
      let mainFragment = tabPanel.querySelector('.contentfragment');
      if (!mainFragment) mainFragment = tabPanel;
      content = mainFragment;
    } else {
      content = '';
    }
    return [label, content];
  });
  // The cells array for createTable: header, then tab rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
