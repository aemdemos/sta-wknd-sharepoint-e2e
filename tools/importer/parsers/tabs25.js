/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the one with .cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements inside ol)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Each tab label has aria-controls pointing to the corresponding tabpanel's id
  const rows = [];
  // Header row - must be single column, exactly as in the example
  rows.push(['Tabs (tabs25)']);

  tabLabelEls.forEach(li => {
    const label = li.textContent.trim();
    const panelId = li.getAttribute('aria-controls');
    const panel = panelId && tabsBlock.querySelector(`#${panelId}`);
    let contentCell = '';
    if (panel) {
      // Get all children, except empty grid wrappers
      const contentNodes = [];
      panel.childNodes.forEach(node => {
        if (node.nodeType === 1) {
          // skip empty grids (aem-Grid with no children)
          if (
            node.classList &&
            node.classList.contains('aem-Grid') &&
            node.children.length === 0
          ) {
            return;
          }
          contentNodes.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // non-empty text node
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          contentNodes.push(span);
        }
      });
      // If panel contains only one child, use it directly, otherwise use array
      contentCell = contentNodes.length > 1 ? contentNodes : (contentNodes[0] || '');
    }
    rows.push([label, contentCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
