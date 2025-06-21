/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs wrapper (look for .tabs > .cmp-tabs inside the context element)
  const tabsSection = element.querySelector('.tabs');
  if (!tabsSection) return;

  const cmpTabs = tabsSection.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.children : []).map(li => li && li.textContent ? li.textContent.trim() : '');
  // Get all tab panels (in order)
  const panels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose rows: [label, panel] referencing existing panel nodes
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    const panel = panels[i] || '';
    rows.push([label, panel]);
  }

  // Build the table array with block name as the only header cell
  const table = [
    ['Tabs (tabs37)'],
    ...rows
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
