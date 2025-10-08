/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (the element with class 'tabs' and a child with class 'cmp-tabs')
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab headers (tab labels)
  const tabHeaderEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (tab content)
  const tabPanelEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure we have matching number of headers and panels
  if (tabHeaderEls.length === 0 || tabPanelEls.length === 0) return;

  // Build table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs24)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabHeaderEls.length; i++) {
    const label = tabHeaderEls[i].textContent.trim();
    // Defensive: get the corresponding panel, fallback to empty div if not found
    const panel = tabPanelEls[i] || document.createElement('div');
    // For resilience, use the entire tabpanel element as content
    rows.push([label, panel]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
