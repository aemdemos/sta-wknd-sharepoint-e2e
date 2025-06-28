/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the given element
  const tabsCmp = element.querySelector('.cmp-tabs');
  if (!tabsCmp) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsCmp.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tabpanel elements (in order)
  const tabPanels = Array.from(
    tabsCmp.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process as many panels as there are labels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Compose table header row: two columns, with block name in first cell and empty in second (to match example)
  const headerRow = ['Tabs (tabs29)', ''];

  // Compose content rows: each row is [tab label, tab content]
  // Tab content uses the main article inside each tabpanel, or the panel itself if no article
  const rows = [];
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentElem = panel.querySelector('article');
    if (!contentElem) contentElem = panel;
    rows.push([label, contentElem]);
  }

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
