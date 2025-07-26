/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Extract tab panel content, referencing existing elements
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');
  if (tabPanels.length === 0 || tabLabels.length === 0) return;

  // Build the rows: each row is [Tab Label, Tab Content]
  const rows = [];
  tabPanels.forEach((panel, idx) => {
    const label = tabLabels[idx] || '';
    // Prefer referencing the main content <article> inside the tabpanel if present, else the panel itself
    let contentElem = panel.querySelector('article');
    if (!contentElem) contentElem = panel;
    rows.push([label, contentElem]);
  });

  // Create table manually so we can set colspan on the header
  const numCols = 2;
  const table = document.createElement('table');

  // Header row with colspan
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.setAttribute('colspan', numCols.toString());
  headerTh.textContent = 'Tabs (tabs14)';
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Add all tab rows
  for (const row of rows) {
    const tr = document.createElement('tr');
    for (const cell of row) {
      const td = document.createElement('td');
      if (typeof cell === 'string') {
        td.textContent = cell;
      } else if (Array.isArray(cell)) {
        td.append(...cell);
      } else {
        td.append(cell);
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  // Replace the tabs block in the DOM with the new table
  tabsBlock.replaceWith(table);
}
