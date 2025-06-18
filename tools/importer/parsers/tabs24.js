/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the section
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find the tab labels (OL > LI, [role=tab])
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Find the tab panels (content for each tab)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row: single cell, but must span columns visually (colspan set later)
  // So, create it as a single-cell row in the array
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // For each tab, add a row with label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] ? tabLabels[i].textContent.trim() : '';
    let content = '';
    if (tabPanels[i]) {
      // For tab content, use the main content inside .contentfragment if present, else the panel
      const contentFragment = tabPanels[i].querySelector('.contentfragment');
      content = contentFragment ? contentFragment : tabPanels[i];
    }
    rows.push([label, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Set colspan on the first header row cell if there is more than one column in the tab rows
  if (rows.length > 1 && rows[1].length > 1) {
    const th = table.querySelector('th');
    if (th) {
      th.setAttribute('colspan', rows[1].length);
    }
  }

  tabs.replaceWith(table);
}
