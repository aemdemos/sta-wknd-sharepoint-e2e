/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels
  const tabLabelEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Get all tab panels (content), matching the order of labels
  let tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > .cmp-tabs__tabpanel'));
  if (tabPanels.length === 0) {
    tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  }

  // Build rows. Header row is a single cell per the example.
  const rows = [];
  rows.push(['Tabs (tabs3)']); // Header row: exactly one cell

  // For each tab: build a single cell row containing both label and content as a fragment
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    let panel = tabPanels[i];
    if (!panel) {
      panel = document.createElement('div');
    }
    // Create a container with label and content for the single cell
    const container = document.createElement('div');
    const labelDiv = document.createElement('div');
    labelDiv.textContent = label;
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.marginBottom = '0.5em';
    container.appendChild(labelDiv);
    container.appendChild(panel);
    rows.push([container]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace tabs block with the new table
  tabsBlock.replaceWith(table);
}
