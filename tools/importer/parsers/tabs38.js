/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabItems.map(tab => tab.textContent.trim());

  // Get all tabpanel elements in the order they appear
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));
  if (tabPanels.length !== tabLabels.length) {
    // If the number of panels and tabs does not match, ignore this block
    return;
  }

  // Use document's Node reference to avoid ReferenceError
  const { Node } = document.defaultView;

  // Table header row: block name
  const headerRow = ['Tabs (tabs38)'];
  // Table tab labels row
  const labelRow = tabLabels;
  // Table tab content row: each cell is all children (DOM nodes) of the corresponding tabpanel
  const contentRow = tabPanels.map((panel) => {
    // Get all direct children (to preserve structure)
    const children = Array.from(panel.childNodes)
      .filter(node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim()));
    // If only one child, return it directly, else return array
    return children.length === 1 ? children[0] : children;
  });

  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block (the full .cmp-tabs element) with the new table
  tabsRoot.replaceWith(block);
}
