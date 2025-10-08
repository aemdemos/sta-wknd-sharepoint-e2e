/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (tab navigation and panels)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Tab headers: get tab labels in order
  const tabHeaderEls = cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab');
  const tabLabels = Array.from(tabHeaderEls).map(tab => tab.textContent.trim());

  // Tab panels: get tab content in order
  const tabPanelEls = cmpTabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Defensive: ensure we have matching tabs and panels
  const tabCount = Math.min(tabLabels.length, tabPanelEls.length);

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs3)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    // Defensive: skip if missing
    if (!label || !panel) continue;

    // Extract the visible content of the tab panel
    // We'll keep the panel's children (not the panel wrapper itself)
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      // Remove empty text nodes
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
      // Remove empty divs
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.childNodes.length === 0) return false;
      return true;
    });
    // If the only child is a single wrapper div (common in AEM), unwrap it
    let content;
    if (contentNodes.length === 1 && contentNodes[0].nodeType === Node.ELEMENT_NODE && contentNodes[0].tagName === 'DIV') {
      content = Array.from(contentNodes[0].childNodes);
    } else {
      content = contentNodes;
    }
    // Remove empty text nodes from content
    content = content.filter(node => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
      return true;
    });
    // If content is a single node, use it directly, else as array
    const cellContent = content.length === 1 ? content[0] : content;
    rows.push([label, cellContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
