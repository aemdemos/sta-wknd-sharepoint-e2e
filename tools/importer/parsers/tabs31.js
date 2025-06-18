/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels from .cmp-tabs__tablist > li
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Extract all tab panels (order matters, must match tab labels order)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabPanels.length !== tabLabels.length) return;

  // Build the table rows: first row is header, then one row per tab: [tab label, tab content]
  const rows = [
    ['Tabs (tabs31)']
  ];

  tabLabels.forEach((label, idx) => {
    // For each tab, get the associated panel
    const panel = tabPanels[idx];
    // Collect all direct child nodes (elements and non-empty text nodes)
    const children = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === 1) return true;
      if (node.nodeType === 3 && node.textContent.trim()) return true;
      return false;
    });
    rows.push([label, children.length === 1 ? children[0] : children]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element in the DOM
  element.replaceWith(table);
}
