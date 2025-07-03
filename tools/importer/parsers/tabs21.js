/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block root from the provided element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Extract the tab labels from the ordered list
  const tabListItems = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  const tabLabels = tabListItems.map(li => li.textContent.trim());

  // Extract the tab panels in order
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Prepare the rows for the block table
  const rows = [];
  rows.push(['Tabs (tabs21)']); // Header row: block name only, as per requirements

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // For tab content, reference the contentfragment/article if present, else all panel content
    let contentElem = panel.querySelector('article.cmp-contentfragment') || panel;
    rows.push([label, contentElem]);
  }

  // Create the block table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
