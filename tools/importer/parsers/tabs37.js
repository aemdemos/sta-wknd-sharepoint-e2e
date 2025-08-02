/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (AEM's cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (li.cmp-tabs__tab)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li.cmp-tabs__tab')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(tabs.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]'));

  // Map tab label to content, referencing existing elements instead of cloning
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // The primary tab content is inside .contentfragment > article > .cmp-contentfragment__elements
      const cfe = panel.querySelector('article > .cmp-contentfragment__elements');
      if (cfe) {
        // Directly reference the cmp-contentfragment__elements node
        contentCell = cfe;
      } else {
        // Fallback: use the whole panel
        contentCell = panel;
      }
    }
    rows.push([label, contentCell]);
  }

  // Header row must match the block name exactly
  const tableData = [
    ['Tabs (tabs37)'],
    ...rows
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabs block in the DOM
  tabs.replaceWith(table);
}
