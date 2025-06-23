/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  const tabLabels = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // Map tab panels by id
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  const panelById = {};
  tabPanels.forEach(panel => {
    panelById[panel.id] = panel;
  });

  // Build header row, label row, and one content row per tab
  const rows = [];
  // 1. Header row
  rows.push(['Tabs (tabs31)']);
  // 2. Tab labels row
  rows.push(tabLabels);
  // 3. Content rows (each with content in the appropriate column, rest empty)
  tabLabelEls.forEach((tabEl, idx) => {
    const panelId = tabEl.getAttribute('aria-controls');
    const panel = panelById[panelId];
    let content = '';
    if (panel) {
      // Get all non-empty child nodes
      const nodes = Array.from(panel.childNodes).filter(n => {
        if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
        if (n.nodeType === Node.ELEMENT_NODE) return n.outerHTML.trim().length > 0;
        return false;
      });
      if (nodes.length === 1) {
        content = nodes[0];
      } else if (nodes.length > 1) {
        content = nodes;
      }
    }
    const row = tabLabels.map((_, i) => (i === idx ? content : ''));
    rows.push(row);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the new block
  tabs.replaceWith(table);
}
