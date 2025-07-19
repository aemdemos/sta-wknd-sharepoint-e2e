/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the supplied element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements with role="tab")
  const tabLabelElements = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  // Get all tab panel elements (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanelElements = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  if (tabLabelElements.length !== tabPanelElements.length || tabLabelElements.length === 0) return;

  // Header row: exactly one column as per the markdown example
  const headerRow = ['Tabs (tabs37)'];
  // Tab label row: one cell per tab label
  const tabLabelRow = tabLabelElements.map(tab => tab.textContent.trim());
  // Tab content row: one cell per tab panel
  const tabContentRow = tabPanelElements.map(panel => {
    // Collect meaningful nodes (ignore grid wrappers and empty divs)
    const nodes = [];
    panel.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        nodes.push(document.createTextNode(node.textContent));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const cls = node.className || '';
        if (
          cls.includes('aem-Grid') ||
          cls.includes('aem-Grid--') ||
          (node.tagName === 'DIV' && !node.textContent.trim() && node.children.length === 0)
        ) {
          // skip grid wrappers and empty divs
          return;
        }
        nodes.push(node);
      }
    });
    if (nodes.length === 0) {
      const cf = panel.querySelector('.cmp-contentfragment__elements');
      if (cf) return cf;
      return panel;
    }
    return nodes.length === 1 ? nodes[0] : nodes;
  });

  // Compose the table structure: header row (1 col), tab label row (N cols), tab content row (N cols)
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
