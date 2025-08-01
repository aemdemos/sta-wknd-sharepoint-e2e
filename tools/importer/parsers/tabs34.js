/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (tab headers)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Compose the header row (always single cell, exactly matching the example)
  const headerRow = ['Tabs (tabs34)'];

  // Compose tab labels row: use the label text
  const labelsRow = tabLabels.map(tab => tab.textContent.trim());

  // Find the active tab panel (Overview)
  let activeIdx = tabLabels.findIndex(label => label.classList.contains('cmp-tabs__tab--active') || label.getAttribute('aria-selected') === 'true');
  if (activeIdx === -1) activeIdx = 0;
  const activePanel = tabPanels[activeIdx];

  // Reference ALL content nodes (not clones) from the active tab panel, preserving structure and text
  // Remove empty aem-Grid wrappers and pass through the content beneath
  function getActualContent(parent) {
    // Find all children that are not empty grids. If a grid, pass through its children recursively.
    const nodes = [];
    parent.childNodes.forEach(node => {
      if (node.nodeType === 1) {
        const className = node.className || '';
        if (/aem-Grid/.test(className)) {
          nodes.push(...getActualContent(node));
        } else if (className === '' && node.childNodes.length > 0) {
          // Sometimes extra empty div wrappers, flatten them
          nodes.push(...getActualContent(node));
        } else {
          nodes.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        nodes.push(node);
      }
    });
    return nodes;
  }

  const tabContent = getActualContent(activePanel).filter(node => {
    // Filter out empty text nodes and whitespace
    if (node.nodeType === 3 && !node.textContent.trim()) return false;
    if (node.nodeType === 1 && node.textContent.trim() === '' && node.children.length === 0) return false;
    return true;
  });

  // If no content, fallback to panel text content
  const cellContent = tabContent.length ? tabContent : [document.createTextNode(activePanel.textContent.trim())];

  // The content row: one cell with actual content, rest are empty strings to fill columns
  const contentRow = [cellContent];
  while (contentRow.length < labelsRow.length) {
    contentRow.push('');
  }

  // Compose the cells array: header row, label row, content row
  const cells = [headerRow, labelsRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(table);
}
