/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root: look for .cmp-tabs inside the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);
  const tabLabels = tabItems.map((tab) => tab.textContent.trim());

  // Get all tab panels, in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the table rows
  const cells = [];
  // Header row: matches the requested block name exactly
  cells.push(['Tabs (tabs38)']);

  // For each tab, add a row [label, content]
  for (let i = 0; i < Math.max(tabLabels.length, tabPanels.length); i += 1) {
    const label = tabLabels[i] || '';
    // The tab panel content
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Reference direct children of the panel for resilience and semantic fidelity
      const contentArr = Array.from(panel.childNodes).filter(node => {
        // Ignore whitespace-only text nodes
        return node.nodeType !== Node.TEXT_NODE || node.textContent.trim();
      });
      // Use array if more than one node, or single node if only one
      if (contentArr.length === 1) {
        content = contentArr[0];
      } else if (contentArr.length > 1) {
        content = contentArr;
      }
    }
    cells.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
