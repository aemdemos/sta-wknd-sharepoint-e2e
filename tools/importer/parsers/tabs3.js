/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels in order
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels, in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the rows for the block table: first row is the header
  const cells = [['Tabs (tabs3)']];

  // For each tab, add a row: [Tab Label, Tab Content (reference to DOM)]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelElem = tabLabels[i];
    // Defensive: If label missing, fallback to empty string
    const tabLabel = labelElem ? labelElem.textContent.trim() : '';
    const tabPanel = tabPanels[i];
    let tabContent;
    if (tabPanel) {
      // Always reference the existing children of the tabPanel
      // If tabPanel has only one child, use it directly; if more, use array (as per requirements)
      const children = Array.from(tabPanel.childNodes).filter(
        node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
      );
      if (children.length === 0) {
        tabContent = '';
      } else if (children.length === 1) {
        tabContent = children[0];
      } else {
        tabContent = children;
      }
    } else {
      tabContent = '';
    }
    cells.push([tabLabel, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
