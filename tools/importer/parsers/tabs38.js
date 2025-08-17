/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (the one with class .cmp-tabs)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;

  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  // Find all tab panels
  const panelEls = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Compose table rows
  const rows = [];
  // Header row - use block name exactly as in the example
  rows.push(['Tabs (tabs38)']);

  // For each tab, find label and its content panel
  tabLabelEls.forEach((tabEl) => {
    const label = tabEl.textContent.trim();
    // The aria-controls attribute points to the tabpanel
    const panelId = tabEl.getAttribute('aria-controls');
    const panelEl = tabsRoot.querySelector(`#${panelId}`);
    let content;
    if (panelEl) {
      // Reference all child elements of the panelEl directly, preserving structure
      // Remove empty text nodes
      const nodes = Array.from(panelEl.childNodes).filter(n => !(n.nodeType === 3 && !n.textContent.trim()));
      if (nodes.length === 1) {
        content = nodes[0];
      } else if (nodes.length > 1) {
        content = nodes;
      } else {
        content = '';
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabsRoot element with the table
  tabsRoot.replaceWith(table);
}
