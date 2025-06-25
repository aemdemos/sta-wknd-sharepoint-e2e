/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (li.cmp-tabs__tab)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;

  // Get array of tab labels (use textContent)
  const tabLabelElements = Array.from(tabList.querySelectorAll('li.cmp-tabs__tab'));
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Get all tabpanel elements (div[role=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"]'));

  // For each panel, get the content as an array of its child nodes (reference, not clone)
  const tabContents = tabPanels.map(panel => {
    // Reference all children except empty text nodes
    const children = Array.from(panel.childNodes).filter(node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === ''));
    if (children.length === 1) {
      return children[0];
    } else if (children.length > 1) {
      return children;
    } else {
      return '';
    }
  });

  // Compose the table cells: header row (single cell), then labels row, then contents row
  const cells = [
    ['Tabs (tabs29)'], // header row
    tabLabels,        // tab label row (one cell per label)
    tabContents       // tab contents row (one cell per content)
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
