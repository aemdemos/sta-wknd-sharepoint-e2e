/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Header row
  const cells = [['Tabs (tabs30)']];

  // Extract tab labels
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  // Extract all tab panels (in order)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process up to the min of available tabs/panels
  const count = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < count; i++) {
    const tabLabel = tabLabels[i].textContent.trim();
    const tabPanel = tabPanels[i];
    // Find main content for this tab
    // Usually an <article> inside a .contentfragment in the tabPanel
    let content = null;
    if (tabPanel) {
      // Prefer the <article> if present
      const article = tabPanel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Otherwise, collect all children (skip empty text nodes)
        const children = Array.from(tabPanel.childNodes).filter(
          node => !(node.nodeType === 3 && !node.textContent.trim()) // skip whitespace text nodes
        );
        if (children.length === 1) {
          content = children[0];
        } else if (children.length > 1) {
          // If there are multiple, group them in a div
          const wrapper = document.createElement('div');
          children.forEach(child => wrapper.appendChild(child));
          content = wrapper;
        }
      }
    }
    cells.push([tabLabel, content]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
