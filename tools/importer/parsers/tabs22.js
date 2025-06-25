/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (order matters)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll(':scope > .cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (tab content), in order
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll(':scope > .cmp-tabs__tabpanel')
  );
  if (tabLabels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Prepare tab content array
  const tabContents = tabPanels.map(panel => {
    // Use all child nodes (including text nodes)
    const nodes = Array.from(panel.childNodes).filter(
      node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
    );
    // If only one node, use it directly; otherwise, use array
    return nodes.length === 1 ? nodes[0] : nodes;
  });

  // Build cells: header (1 col), labels (n col), contents (n col)
  const cells = [];
  // First row: block name as a single column
  cells.push(['Tabs (tabs22)']);
  // Second row: tab labels as header columns
  cells.push(tabLabels);
  // Third row: tab contents as columns
  cells.push(tabContents);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
