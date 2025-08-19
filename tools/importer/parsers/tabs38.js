/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root inside the supplied element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Find all tab labels in order
  const tabLabels = Array.from(tabsRoot.querySelectorAll(':scope > .cmp-tabs__tablist .cmp-tabs__tab'));
  // Find all tab panels in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll(':scope > [role="tabpanel"]'));

  // Edge case: do nothing if no tabs
  if (!tabLabels.length || !tabPanels.length) return;

  // Always use the block name from Block Table Creation
  const headerRow = ['Tabs (tabs38)'];

  // For each tab, find the label and the corresponding tab panel's content
  const rows = tabLabels.map((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    // If panel missing, leave cell empty
    const panel = tabPanels[idx] || document.createElement('div');
    // Use the first <article> inside the panel if present, else the panel itself
    const content = panel.querySelector('article') || panel;
    return [label, content];
  });

  // Assemble the table rows
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
