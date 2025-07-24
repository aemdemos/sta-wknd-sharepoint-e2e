/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabelNodes = tabsRoot.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelNodes).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row (block name, 1 col)
  const headerRow = ['Tabs (tabs31)'];

  // Content rows: each row is [tab label, tab content] (all <td> by default)
  const contentRows = tabPanels.map((panel, idx) => {
    // Find label for this panel
    let tabLabel = '';
    const labelledby = panel.getAttribute('aria-labelledby');
    if (labelledby) {
      const match = Array.from(tabLabelNodes).find(tab => tab.id === labelledby);
      if (match) tabLabel = match.textContent.trim();
    }
    if (!tabLabel) tabLabel = tabLabels[idx] || '';
    // Collect all element children as tab content
    let content;
    if (panel.children.length === 1) {
      content = panel.children[0];
    } else {
      content = Array.from(panel.children);
    }
    return [tabLabel, content];
  });

  // Build the cells array for the table
  const cells = [
    headerRow,
    tabLabels, // second row as plain strings; we'll convert to <th> below
    ...contentRows
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // The first row is <th> (block name), but the second row needs to use <th> for tab labels.
  // By default, createTable will use <td> for this row, so we fix it manually.
  const trs = table.querySelectorAll('tr');
  if (trs[1]) {
    const tds = Array.from(trs[1].children);
    tds.forEach(td => {
      if (td.tagName.toLowerCase() !== 'th') {
        const th = document.createElement('th');
        th.innerHTML = td.innerHTML;
        td.replaceWith(th);
      }
    });
  }

  tabsRoot.replaceWith(table);
}
