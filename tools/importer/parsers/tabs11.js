/* global WebImporter */
export default function parse(element, { document }) {
  // Locate .cmp-tabs inside the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tab list
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // Get the tab panels (content for each tab) in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Header row with block name
  const headerRow = ['Tabs (tabs11)'];
  // Second row: tab labels
  const labelsRow = tabLabels;
  // Content rows: one per tab, content in correct column, others blank
  const tabRows = tabPanels.map((panel, i) => {
    // Create a row with as many columns as tabs, all blank except the current
    const row = new Array(tabLabels.length).fill('');
    // Reference the existing content node (the 'panel'), not a clone
    // But we should avoid moving the actual panel from source, so wrap the panel's children in a fragment
    // (If we moved the real panel, it would break the source structure for later blocks)
    const frag = document.createDocumentFragment();
    // Move all children (not just text, but elements and images)
    Array.from(panel.childNodes).forEach(node => {
      frag.appendChild(node);
    });
    row[i] = frag.childNodes.length === 1 ? frag.firstChild : frag;
    return row;
  });

  // Compose the table data:
  const tableData = [headerRow, labelsRow, ...tabRows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
