/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block's main container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Find the tab label elements
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  if (tabLabelEls.length === 0) return;
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Find all tab panels in label order using aria-controls on the tab
  const tabPanels = tabLabelEls.map(tabEl => {
    const panelId = tabEl.getAttribute('aria-controls');
    if (panelId) {
      return tabsContainer.querySelector(`#${panelId}`);
    }
    return null;
  });

  // Compose the rows: first row is header, then one row per tab (two columns per row)
  // To achieve a header cell that spans both columns, we will use a placeholder string and set colspan later
  const cells = [];
  // Header row: single cell, to be made colspan=2 in the table
  cells.push(["Tabs (tabs36)"]);

  // Each tab gets a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Reference all children of the tab panel directly (preserves formatting and semantics)
    const children = Array.from(panel.childNodes).filter(node =>
      node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== ''
    );
    let contentCell;
    if (children.length === 1) {
      // Single child (often a div)
      contentCell = children[0];
    } else {
      // Multiple children: wrap in a container
      const wrapper = document.createElement('div');
      children.forEach(child => wrapper.appendChild(child));
      contentCell = wrapper;
    }
    cells.push([label, contentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix the header row to span two columns if needed
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
