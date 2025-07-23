/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabItems.map(li => li.textContent.trim());

  // Extract tab panels in the same order as tabLabels
  // Tab panels have role="tabpanel"
  const allPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  // Map tab panel id to element for lookup
  const panelsById = {};
  allPanels.forEach(panel => {
    panelsById[panel.id] = panel;
  });

  // Find the id of each panel by li's aria-controls
  const tabContents = tabItems.map(li => {
    const panelId = li.getAttribute('aria-controls');
    const panel = panelsById[panelId];
    if (!panel) return '';
    // For each tab panel, extract its main content. Reference existing elements.
    let contentNodes = [];
    for (const node of Array.from(panel.childNodes)) {
      // Ignore empty text nodes
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') continue;
      contentNodes.push(node);
    }
    if (contentNodes.length === 1) {
      return contentNodes[0];
    } else if (contentNodes.length > 1) {
      return contentNodes;
    } else {
      // fallback: no children, maybe text content only
      return panel.textContent.trim();
    }
  });

  // Build the rows for the table block
  // Row 0: block name header (single cell)
  // Row 1: tab labels (each in its own cell)
  // Row 2: tab contents (each in its own cell)
  const rows = [];
  rows.push(['Tabs (tabs24)']);
  rows.push(tabLabels);
  rows.push(tabContents);

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs container with the new block table
  tabs.replaceWith(block);
}
