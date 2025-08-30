/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map((tab) => tab.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the table rows
  // Header row: block name exactly as specified
  const headerRow = ['Tabs (tabs3)'];

  // Second row: all tab labels as strong elements, each in its own cell, then the tab contents as the second cell
  // The example shows a table with first row as header, then a row per tab (label in first cell, content in second)
  // So we build that structure
  const rows = [headerRow];

  // For each tab/tabpanel, create a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label (strong)
    const labelStrong = document.createElement('strong');
    labelStrong.textContent = tabLabels[i];

    // Tab content: find the corresponding panel
    // Sometimes the number of panels may not match the number of labels (edge case)
    let contentCell;
    if (i < tabPanels.length) {
      const panel = tabPanels[i];
      // Use all child nodes of the panel (not the panel container itself)
      // Reference the nodes directly from the DOM (do NOT clone or create new ones)
      const children = Array.from(panel.childNodes).filter(n => {
        // Remove empty text nodes or empty divs
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') return false;
        if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'DIV' && n.innerHTML.trim() === '') return false;
        return true;
      });
      // If there is just one element, use it, else use the array
      contentCell = (children.length === 1) ? children[0] : children;
    } else {
      // No content panel for this tab; leave empty
      contentCell = '';
    }
    rows.push([labelStrong, contentCell]);
  }

  // Create the block table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
