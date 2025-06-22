/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (by class 'cmp-tabs') inside the supplied element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all the tab labels (li)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all the tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Build the table header: block name as a single cell row
  const headerRow = ['Tabs (tabs22)'];
  // Second row: the tab labels in one row (each label in a separate column)
  const tabLabelRow = tabLabels.map(tab => tab.textContent.trim());
  // Next rows: for each tab, give its content in the corresponding column only
  const tabContentRows = tabPanels.map((panel, idx) => {
    // Prefer to extract main content area (skip grid wrappers, etc.)
    let content = null;
    const fragment = panel.querySelector('.cmp-contentfragment__elements');
    if (fragment) {
      // Remove empty grid wrappers
      const goodNodes = Array.from(fragment.childNodes).filter(node => {
        if (node.nodeType !== 1) return true;
        if (node.classList.contains('aem-Grid') || node.classList.contains('aem-Grid--12') || node.classList.contains('aem-Grid--default--12')) {
          return node.children.length > 0;
        }
        return true;
      });
      content = goodNodes.length === 1 ? goodNodes[0] : goodNodes;
    } else {
      // fallback: exclude h3 from article
      const article = panel.querySelector('article');
      if (article) {
        const nodes = Array.from(article.childNodes).filter(n => !(n.nodeType === 1 && n.tagName.match(/^h[1-6]$/i)));
        content = nodes.length === 1 ? nodes[0] : nodes;
      } else {
        // fallback: everything in panel except heading
        const nodes = Array.from(panel.childNodes).filter(n => !(n.nodeType === 1 && n.tagName.match(/^h[1-6]$/i)));
        content = nodes.length === 1 ? nodes[0] : nodes;
      }
    }
    // Make a row of N columns, only one column has content
    return tabLabels.map((_, j) => (j === idx ? content : ''));
  });

  // Compose table: headerRow (one cell), tabLabelRow (n cells), then one row per tab (n cells)
  const table = [headerRow, tabLabelRow, ...tabContentRows];

  // Create the table
  const blockTable = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(blockTable);
}
