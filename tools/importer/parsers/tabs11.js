/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements with role="tab")
  const tabLabels = Array.from(tabsRoot.querySelectorAll('[role="tab"]'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: number of tabs and number of panels must match
  // If not, skip or match up to min length
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Header row as required by the block spec
  const headerRow = ['Tabs (tabs11)'];

  // Build each tab row: [Label, Content]
  const rows = [];
  for (let i = 0; i < count; i++) {
    // Label: always plain text
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Find the article/contentfragment; otherwise use the panel itself
    let contentElem = panel.querySelector('article') || panel;
    rows.push([label, contentElem]);
  }

  // Compose the table data: header + tab rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire .tabs block (not just cmp-tabs) with the table
  const tabsBlock = element.querySelector('.tabs');
  if (tabsBlock) {
    tabsBlock.parentNode.replaceChild(table, tabsBlock);
  }
}
