/* global WebImporter */
export default function parse(element, { document }) {
  // Find the correct tabs block inside the provided element
  const tabsOuter = element.querySelector('.tabs');
  if (!tabsOuter) return;
  const tabsCmp = tabsOuter.querySelector('.cmp-tabs');
  if (!tabsCmp) return;

  // Find all tab label elements (li's in tablist)
  const tabLabels = Array.from(tabsCmp.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find all tab panels (these are the tab content containers)
  const tabPanels = Array.from(tabsCmp.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build rows: first is header (single column), rest are two columns per tab
  const rows = [];
  rows.push(['Tabs (tabs18)']);
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Collect all child nodes except empty text nodes
      const children = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return !!node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          return true;
        }
        return false;
      });
      if (children.length === 1) {
        content = children[0];
      } else if (children.length > 1) {
        // If multiple, put in a div for structure
        const container = document.createElement('div');
        children.forEach(child => container.appendChild(child));
        content = container;
      }
    }
    rows.push([label, content]);
  }

  // We need to ensure the first row is a single column, rest are two columns
  // WebImporter.DOMUtils.createTable pads all rows to the max column count, so we must split table generation
  const table = document.createElement('table');
  // Header row (single cell)
  const trHead = document.createElement('tr');
  const thHead = document.createElement('th');
  thHead.innerHTML = rows[0][0];
  trHead.appendChild(thHead);
  table.appendChild(trHead);
  // Data rows (two cells)
  for (let i = 1; i < rows.length; i++) {
    const tr = document.createElement('tr');
    rows[i].forEach(cell => {
      const td = document.createElement('td');
      if (typeof cell === 'string') {
        td.innerHTML = cell;
      } else if (Array.isArray(cell)) {
        td.append(...cell);
      } else if (cell) {
        td.append(cell);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  }

  tabsOuter.replaceWith(table);
}
