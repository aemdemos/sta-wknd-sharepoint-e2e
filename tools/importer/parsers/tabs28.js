/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find the tab labels from tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.children : []).map(li => li.textContent.trim());

  // Find all tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: first row is header, then one row per tab: [label, content]
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs28)']);

  // For each tab panel, extract
  tabPanels.forEach((panel, i) => {
    // Find label for this tab
    let label = tabLabels[i] || `Tab ${i+1}`;
    // The tab content is the inner HTML of the panel
    // If the tabpanel contains a single child that is an article, reference that
    let content;
    if (
      panel.children.length === 1 &&
      panel.children[0].tagName.toLowerCase() === 'div' &&
      panel.children[0].children.length === 1 &&
      panel.children[0].children[0].tagName.toLowerCase() === 'article'
    ) {
      content = panel.children[0].children[0];
    } else if (
      panel.children.length === 1 &&
      panel.children[0].tagName.toLowerCase() === 'article'
    ) {
      content = panel.children[0];
    } else {
      // fallback: reference the whole panel
      content = panel;
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element with the block
  tabs.replaceWith(block);
}
