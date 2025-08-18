/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const tabsEl = tabsWrapper.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Extract tab labels and panels
  const tabLabels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build table: header is a single cell, each tab is its own row with two columns
  const cells = [];
  // Header row: ONLY block name, single cell
  cells.push(['Tabs (tabs12)']);
  // Each tab row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const panel = tabPanels[i];
    let content = panel.querySelector('article');
    if (!content) content = panel;
    cells.push([tabLabels[i], content]);
  }

  // Create table (force header row to have only one cell)
  const table = document.createElement('table');
  cells.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    // For the header row, ensure only one <th> and set colspan for two columns
    if (rowIndex === 0) {
      const th = document.createElement('th');
      th.innerHTML = row[0];
      th.colSpan = 2;
      tr.appendChild(th);
    } else {
      row.forEach(cell => {
        const td = document.createElement('td');
        if (typeof cell === 'string') {
          td.innerHTML = cell;
        } else if (Array.isArray(cell)) {
          td.append(...cell);
        } else {
          td.append(cell);
        }
        tr.appendChild(td);
      });
    }
    table.appendChild(tr);
  });

  // Replace tabs block with new table
  tabsWrapper.parentNode.replaceChild(table, tabsWrapper);
}
