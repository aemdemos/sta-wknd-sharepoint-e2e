/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (by class)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Prepare header row as in the block spec
  const headerRow = ['Tabs (tabs36)'];

  // Get tab labels (li elements inside .cmp-tabs__tablist)
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tablist ? Array.from(tablist.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim()) : [];

  // Get tab panels (in order)
  const panels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only build for as many labels/panels as are available
  const tabCount = Math.min(tabLabels.length, panels.length);
  const rows = [];

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = panels[i];
    // Reference the actual panel element in the table cell, per spec
    rows.push([label, panel]);
  }

  // Compose the cells array
  const cells = [headerRow, ...rows];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs element with the block table
  tabs.replaceWith(table);
}
