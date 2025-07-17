/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the element
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab headers
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabHeaders = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];

  // Get all tabpanels (in order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare rows for the tabs table
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs15)']);

  // For each tab, assemble a row [label, content]
  for (let i = 0; i < tabHeaders.length; i++) {
    const header = tabHeaders[i];
    const label = header ? header.textContent.trim() : '';
    const tabPanel = tabPanels[i];
    let tabContent = null;
    if (tabPanel) {
      // Always reference the tabpanel's first .contentfragment if it exists, otherwise the entire tabPanel.
      const fragment = tabPanel.querySelector('.contentfragment');
      if (fragment) {
        tabContent = fragment;
      } else {
        tabContent = tabPanel;
      }
    } else {
      // Defensive: try to match aria-controls (shouldn't be necessary for this HTML)
      const ariaControls = header.getAttribute('aria-controls');
      if (ariaControls) {
        const panelById = cmpTabs.querySelector('#' + ariaControls);
        if (panelById) {
          const fragment = panelById.querySelector('.contentfragment');
          tabContent = fragment || panelById;
        }
      }
    }
    rows.push([label, tabContent]);
  }

  // Create the table and replace the cmp-tabs node
  const table = WebImporter.DOMUtils.createTable(rows, document);
  cmpTabs.replaceWith(table);
}
