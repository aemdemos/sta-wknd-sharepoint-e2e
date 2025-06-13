/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;
  // Extract tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  ).map(tab => tab.textContent.trim());
  // Extract tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Build header row
  const headerRow = ['Tabs (tabs20)'];
  // Second row: All tab labels in order, one per cell
  const labelsRow = tabLabels;
  // Third row: All tab content in order, one per cell
  const contentRow = tabPanels.map(panel => {
    // Each tabpanel contains a .contentfragment > article
    const article = panel.querySelector('article');
    if (!article) {
      // fallback: put all panel content
      return Array.from(panel.childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim());
    }
    // Remove .cmp-contentfragment__title if present (just the tab label)
    const cfTitle = article.querySelector('.cmp-contentfragment__title');
    if (cfTitle) cfTitle.remove();
    // Find the main content element(s)
    const elements = article.querySelector('.cmp-contentfragment__elements');
    if (elements) {
      // Remove .aem-Grid blocks that are empty containers
      const nodes = Array.from(elements.childNodes).filter(n => {
        // Remove empty text nodes
        if (n.nodeType === 3 && !n.textContent.trim()) return false;
        // Remove empty grid containers
        if (n.nodeType === 1 && n.classList && n.classList.contains('aem-Grid')) return false;
        return true;
      });
      // If all nodes are empty, fallback to the whole elements block
      if (nodes.length > 0) {
        return nodes.length === 1 ? nodes[0] : nodes;
      }
      return elements;
    }
    // fallback: just use what's left in article
    return Array.from(article.childNodes).filter(n => {
      if (n.nodeType === 3 && !n.textContent.trim()) return false;
      return true;
    });
  });
  // Compose the table
  const cells = [
    headerRow,
    labelsRow,
    contentRow
  ];
  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
