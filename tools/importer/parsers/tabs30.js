/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels (li[role=tab]) in order
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get the tab panels in order
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare rows array for createTable
  const rows = [];
  // Header row: block name and variant as in example
  rows.push(['Tabs (tabs30)']);

  // For each tab, push a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] ? tabLabels[i].textContent.trim() : '';
    let contentCell = '';
    // Get the corresponding tab panel
    const panel = tabPanels[i];
    if (panel) {
      // Find the main content fragment/article (if present)
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // Otherwise, put the whole tab panel
        contentCell = panel;
      }
    }
    rows.push([label, contentCell]);
  }

  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
