/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element.querySelector('.cmp-tabs')) return;

  const cmpTabs = element.querySelector('.cmp-tabs');

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Build table rows
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Get all content inside the tabpanel
    // We'll clone the children to avoid moving them from the DOM
    const contentNodes = Array.from(panel.childNodes).map(node => node.cloneNode(true));
    rows.push([label, contentNodes]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
