/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container (the cmp-tabs inside this element)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (the li elements in the tablist)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist li'));

  // Get all tab panels (the .cmp-tabs__tabpanel elements)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: only keep as many labels as there are panels (just in case)
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Build the header row
  const headerRow = ['Tabs (tabs25)'];

  // Build the tab rows: [label, content]
  const rows = [];
  for (let i = 0; i < count; i++) {
    const labelEl = tabLabels[i];
    const label = labelEl ? labelEl.textContent.trim() : '';
    const panel = tabPanels[i];
    let content = null;
    // Find the major content block inside the tab panel
    // Prefer .contentfragment > article, then .contentfragment, then article, else whole panel
    content = panel.querySelector('.contentfragment > article') || panel.querySelector('.contentfragment') || panel.querySelector('article') || panel;
    rows.push([label, content]);
  }

  // Build table data
  const cells = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
