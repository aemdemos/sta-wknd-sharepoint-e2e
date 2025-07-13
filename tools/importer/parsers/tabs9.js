/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabLabelElements.map(tab => tab.textContent.trim());

  // Get all tab panel elements in order
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build table rows according to the example:
  // Header row: single cell with block name
  // Each following row: [Tab Label, Tab Content]
  const rows = [];
  rows.push(['Tabs (tabs9)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Defensive: get matching panel by index
    const panel = tabPanels[i];
    let cellContent = '';
    if (panel) {
      // Reference actual panel children (not cloning)
      const children = Array.from(panel.childNodes).filter(node => {
        return (
          (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') ||
          (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        );
      });
      if (children.length === 1) {
        cellContent = children[0];
      } else if (children.length > 1) {
        cellContent = children;
      }
    }
    rows.push([label, cellContent]);
  }

  // Create the table and replace the .cmp-tabs element with it
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
