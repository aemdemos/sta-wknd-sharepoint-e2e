/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels as <li> from ol[role=tablist]
  const tabList = tabsBlock.querySelector('ol[role=tablist]');
  if (!tabList) return;
  const tabLis = Array.from(tabList.children).filter(li => li.getAttribute('role') === 'tab');

  // Get all tab panels (in DOM order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Compose the header row (single cell)
  const headerRow = ['Tabs (tabs38)'];

  // Compose the tab label row (one label per cell)
  const tabLabelRow = tabLis.map(li => {
    const span = document.createElement('span');
    span.textContent = li.textContent.trim();
    return span;
  });

  // Compose the tab content row (one panel content per cell)
  const tabContentRow = tabPanels.map(panel => {
    // Try to find main content fragment/article
    let content = panel.querySelector('article, .cmp-contentfragment, .cmp-contentfragment__elements, .contentfragment');
    if (!content) {
      // fallback: first child div or the panel itself
      const directDiv = Array.from(panel.children).find(el => el.nodeType === 1 && el.tagName.toLowerCase() === 'div');
      content = directDiv || panel;
    }
    // Remove all .aem-Grid elements that are empty
    if (content !== panel) {
      Array.from(content.querySelectorAll('.aem-Grid')).forEach(grid => {
        if (!grid.textContent.trim() && !grid.querySelector('img')) grid.remove();
      });
    }
    return content;
  });

  // Build final table: header row, then single row for tab labels, then single row for tab content
  const cells = [headerRow, tabLabelRow, tabContentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
