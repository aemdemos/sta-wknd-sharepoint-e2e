/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the <ol> list
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Get all tabpanels (matching order of tabLabels)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the table rows
  // Header row: exactly one column, as per the example
  const rows = [['Tabs (tabs3)']];

  // Each subsequent row: two columns (tab label, tab content)
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const label = labelEl ? labelEl.textContent.trim() : '';
    const panel = tabPanels[i];
    let contentElem = '';
    if (panel) {
      // If only one child, use it directly, otherwise put array of all children
      const children = Array.from(panel.children);
      if (children.length === 1) {
        contentElem = children[0];
      } else if (children.length > 1) {
        contentElem = children;
      } else {
        contentElem = panel.textContent.trim();
      }
    }
    rows.push([label, contentElem]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element with the new block table
  tabs.replaceWith(block);
}
