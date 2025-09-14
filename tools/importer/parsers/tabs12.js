/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Find the main content inside the panel
    let contentBlock = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    rows.push([label, contentBlock]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element itself (not the parent)
  tabs.replaceWith(table);
}
