/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs) within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all the tab labels
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('[role="tab"]'));

  // Get all the tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive check to ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // First row: block name, exactly as required
  const headerRow = ['Tabs (tabs37)'];

  // Second row: tab labels, using their actual DOM text content
  const labelRow = tabLabels.map(label => {
    const span = document.createElement('span');
    span.textContent = label.textContent.trim();
    return span;
  });

  // Each subsequent row: one per tab, first cell is label, second cell is tab content
  const tabRows = tabLabels.map((label, i) => {
    // Tab label cell
    const labelCell = document.createElement('span');
    labelCell.textContent = label.textContent.trim();

    // Tab content cell: Prefer the cmp-contentfragment__elements block, fallback to cmp-contentfragment, fallback to tabpanel
    let contentCell = null;
    const panel = tabPanels[i];
    if (panel) {
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        let main = cf.querySelector('.cmp-contentfragment__elements');
        if (!main) {
          main = cf;
        }
        contentCell = main;
      } else {
        contentCell = panel;
      }
    } else {
      contentCell = document.createElement('div');
    }
    return [labelCell, contentCell];
  });

  // Compose the table:
  //   1. header row (1 col)
  //   2. tab label row (N cols, same as tab count)
  //   3. each tab row (2 cols: label and content)
  const cells = [];
  cells.push(headerRow); // header row
  cells.push(labelRow);  // label row
  tabRows.forEach(row => cells.push(row));

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
