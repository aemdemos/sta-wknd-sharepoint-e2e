/* global WebImporter */
export default function parse(element, { document }) {
  // Find the specific .tabs block inside the given element
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract labels from tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const labelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = labelEls.map(el => el.textContent.trim());

  // Extract tab panels (order is important: must match labels)
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose header row as a single cell array
  const headerRow = ['Tabs (tabs24)'];
  // Compose a row for each tab: [label, content]
  const rows = tabPanelEls.map((panel, idx) => {
    // The label for this tab
    const label = tabLabels[idx] || '';
    // Tab content: gather all direct children that are element nodes (ignore scripts/styles)
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      return node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE';
    });
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    } else {
      contentCell = panel;
    }
    return [label, contentCell];
  });

  // Build the cells array so that the header row is a single cell, then each tab row has two cells
  const cells = [headerRow, ...rows];

  // To ensure proper HTML (colspan if needed), create the table manually:
  const table = document.createElement('table');
  // Header row (single th with colspan)
  const trHead = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = headerRow[0];
  th.colSpan = 2;
  trHead.appendChild(th);
  table.appendChild(trHead);
  // Add each tab row
  for (const row of rows) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = row[0];
    tr.appendChild(td1);
    const td2 = document.createElement('td');
    if (Array.isArray(row[1])) {
      row[1].forEach(el => td2.appendChild(el));
    } else if (row[1] instanceof Element) {
      td2.appendChild(row[1]);
    } else {
      td2.innerHTML = row[1];
    }
    tr.appendChild(td2);
    table.appendChild(tr);
  }
  // Replace the original cmpTabs node with the table
  cmpTabs.replaceWith(table);
}
