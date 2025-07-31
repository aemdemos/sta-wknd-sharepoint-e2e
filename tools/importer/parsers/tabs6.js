/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels
  const tabLabels = [];
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Extract tab panels
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Collect data rows (do NOT include the header row)
  const rows = [];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Prefer .cmp-contentfragment__elements or .contentfragment__elements if present
      let block = panel.querySelector('.cmp-contentfragment__elements, .contentfragment__elements');
      if (block) {
        // Try to collect just the actual content children (ignore empty aem-Grid blocks)
        const children = Array.from(block.childNodes).filter(child => {
          if (child.nodeType === Node.ELEMENT_NODE && child.classList && child.classList.contains('aem-Grid') && child.children.length === 0) {
            return false;
          }
          if (child.nodeType === Node.TEXT_NODE) {
            return !!child.textContent.trim();
          }
          return true;
        });
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          contentCell = block;
        }
      } else {
        // fallback: use all non-empty content from the panel
        const children = Array.from(panel.childNodes).filter(child => {
          if (child.nodeType === Node.ELEMENT_NODE && child.classList && child.classList.contains('aem-Grid') && child.children.length === 0) {
            return false;
          }
          if (child.nodeType === Node.TEXT_NODE) {
            return !!child.textContent.trim();
          }
          return true;
        });
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          contentCell = panel;
        }
      }
    }
    // Each data row is: [Tab Label, Tab Content]
    rows.push([label, contentCell]);
  }

  // Now create the table manually to have a single header cell spanning two columns
  const table = document.createElement('table');
  // Header row: single cell, colspan=2
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.setAttribute('colspan', '2');
  th.textContent = 'Tabs (tabs6)';
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  // Add each data row
  for (const row of rows) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = row[0];
    const td2 = document.createElement('td');
    if (Array.isArray(row[1])) {
      td2.append(...row[1]);
    } else if (row[1] instanceof Node) {
      td2.append(row[1]);
    } else {
      td2.textContent = row[1];
    }
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
  }

  element.replaceWith(table);
}
