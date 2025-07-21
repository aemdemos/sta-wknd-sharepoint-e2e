/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab list (labels)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;

  // Get the tab labels (exact, as in the HTML)
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // Get the tabpanel elements and ensure correct order via aria-labelledby
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // Map tabPanels to tab label index via aria-labelledby
  const panelOrder = tabPanels.map(panel => {
    const labelledBy = panel.getAttribute('aria-labelledby');
    const index = tabLabelEls.findIndex(tab => tab.id === labelledBy);
    return { index, panel };
  });
  // Sort by tab index
  panelOrder.sort((a, b) => a.index - b.index);

  // Compose the block table: header, then one row per tab (label, content)
  const rows = [];
  // Header row exactly as required
  rows.push(['Tabs (tabs21)']);
  // For each tab, add label and content
  panelOrder.forEach(({ index, panel }) => {
    // Use the label from the tab
    const label = tabLabels[index];
    // Content: gather all content nodes of the panel
    // Only include non-empty nodes
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    let contentCell = contentNodes;
    if (contentNodes.length === 0) {
      contentCell = '';
    } else if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    }
    rows.push([label, contentCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element only (not the whole 'element')
  tabs.replaceWith(table);
}
