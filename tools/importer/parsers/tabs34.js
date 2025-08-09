/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels, as text
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li.cmp-tabs__tab').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tabpanels in order -- only immediate children of tabs (to avoid nested tabs)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Compose table according to the block spec:
  // - First row is block name
  // - Each subsequent row: [Tab Label, Tab Content]
  const rows = [['Tabs (tabs34)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // Find all direct children of the panel, skipping empty text nodes
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
        // Don't include empty <div>s with no children or text
        if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length === 0 && !node.textContent.trim()) return false;
        return true;
      });
      // If only one node, use it. If multiple, use array.
      if (contentNodes.length === 0) {
        tabContent = '';
      } else if (contentNodes.length === 1) {
        tabContent = contentNodes[0];
      } else {
        tabContent = contentNodes;
      }
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
