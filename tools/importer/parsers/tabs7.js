/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the list of tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li.cmp-tabs__tab'));
  if (tabLabels.length === 0) return;

  // Get all tabpanels (tab content containers)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Make sure number of tabs matches panels, or handle missing ones.
  const count = Math.max(tabLabels.length, tabPanels.length);

  // Build the two-column rows (labels and content)
  // make the first row the block name as header, as per instructions
  const cells = [
    ['Tabs (tabs7)'],
  ];

  // Add one row per tab (label, content)
  for (let i = 0; i < count; i++) {
    // First cell: tab label (string)
    const label = tabLabels[i] ? tabLabels[i].textContent.trim() : '';
    // Second cell: the tab panel content (use the actual HTML element from the DOM)
    // Reference the first (main) child inside the tabpanel, which is typically a .contentfragment or article
    let contentCell = '';
    if (tabPanels[i]) {
      // If there is a single main article/contentfragment, use that; else use all children
      const mainContent = tabPanels[i].querySelector('article, .cmp-contentfragment, .cmp-contentfragment__elements, .contentfragment');
      if (mainContent) {
        contentCell = mainContent;
      } else {
        // Fallback: use all children (for resilience)
        const childEls = Array.from(tabPanels[i].childNodes).filter(node =>
          node.nodeType !== Node.TEXT_NODE || node.textContent.trim()
        );
        if (childEls.length === 1) {
          contentCell = childEls[0];
        } else if (childEls.length > 1) {
          contentCell = childEls;
        } else {
          contentCell = '';
        }
      }
    }
    cells.push([label, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
