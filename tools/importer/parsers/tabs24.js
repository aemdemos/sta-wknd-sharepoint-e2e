/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tablist) {
    tabLabels = Array.from(tablist.querySelectorAll(':scope > li')).map(li => li.textContent.trim());
  }

  // Get tab panels (tab content)
  const panels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build the table rows
  const cells = [];

  // Header row: block name (single cell)
  cells.push(['Tabs (tabs24)']);

  // Each tab as a row: [label, content]
  for (let i = 0; i < tabLabels.length && i < panels.length; i++) {
    const label = tabLabels[i];
    const panel = panels[i];
    // Use the <article> (main contentfragment) or fallback to panel itself
    let contentElem = panel.querySelector('article') || panel.firstElementChild || panel;
    cells.push([label, contentElem]);
  }

  // Create the tabs block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs block with the table
  tabs.replaceWith(table);
}
