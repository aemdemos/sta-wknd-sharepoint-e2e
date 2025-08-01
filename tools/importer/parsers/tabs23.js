/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Tabs block root
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels from the tablist
  const tabLabelNodes = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));

  // Prepare the cells array with a single-cell header row, as per the example
  const rows = [ ['Tabs (tabs23)'] ];

  // For each tab, get the label and its matching content panel
  tabLabelNodes.forEach((tabLabelNode) => {
    // Get the label
    const labelText = tabLabelNode.textContent.trim();
    
    // Get the tabpanel id from aria-controls
    const tabPanelId = tabLabelNode.getAttribute('aria-controls');
    // Find the tabpanel element
    const tabPanel = tabsContainer.querySelector(`#${tabPanelId}`);

    let contentCell = '';
    if (tabPanel) {
      // Reference all immediate children of the tabPanel for the cell
      const children = Array.from(tabPanel.childNodes).filter(node => {
        // Only include elements or non-empty text
        return node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      });
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      }
    }
    // Each row for a tab must have two columns: [Label, Content]
    rows.push([labelText, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
