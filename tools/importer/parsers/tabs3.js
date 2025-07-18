/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container in the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels (order matches tabLabels)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );
  const minTabs = Math.min(tabLabels.length, tabPanels.length);

  // Header row: single cell only
  const rows = [["Tabs (tabs3)"]];

  // Each row is [tab label, tab content]
  for (let i = 0; i < minTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Use .contentfragment if present, otherwise panel itself
    const contentFragment = panel.querySelector('.contentfragment') || panel;
    let children = Array.from(contentFragment.childNodes).filter(n =>
      n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
    );
    let content;
    if (children.length === 1) {
      content = children[0];
    } else if (children.length > 1) {
      content = children;
    } else {
      content = contentFragment;
    }
    rows.push([label, content]);
  }

  // Create and insert the table, replacing the tabs
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(block);
}
