/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels in order
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li.cmp-tabs__tab').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Helper to get all meaningful children for a panel
  // Node.TEXT_NODE === 3, but Node may not be defined, so use document.ELEMENT_NODE - 1
  const TEXT_NODE = document.ELEMENT_NODE - 1;
  function extractContent(panel) {
    return Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
  }

  // Build the table rows in the correct structure:
  // Row 1: ["Tabs (tabs3)"]
  // Row 2: [tabLabel1, tabLabel2, ...]
  // Row 3+: [tabPanelContent]
  const rows = [];
  rows.push(['Tabs (tabs3)']);
  if (tabLabels.length && tabPanels.length) {
    rows.push(tabLabels);
    // For each panel, add one row with content as the only cell
    for (const panel of tabPanels) {
      const content = extractContent(panel);
      rows.push([content]);
    }
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
