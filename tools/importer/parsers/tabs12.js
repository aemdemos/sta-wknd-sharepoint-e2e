/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (li elements)
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get all tabpanel containers in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare rows for the table
  const rows = [];
  // Header row (must match exactly)
  rows.push(['Tabs (tabs12)']);

  // Each row: [tab label, tab content]
  tabLabels.forEach((label, idx) => {
    // Defensive: some tabs may not have a corresponding panel
    const panel = tabPanels[idx];
    let cellContent = '';
    if (panel) {
      // For the tab content cell, gather visible content only (skip empty divs)
      // We'll collect all element children except empty grid wrappers
      // And also text nodes that are not just whitespace
      const children = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // skip empty AEM grid wrappers
          if (node.classList && Array.from(node.classList).some(c => c.startsWith('aem-Grid'))) {
            return node.textContent.trim().length > 0;
          }
          return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return false;
      });
      if (children.length === 1) {
        cellContent = children[0];
      } else if (children.length > 1) {
        cellContent = children;
      } else {
        // fallback if no direct children (should not occur)
        cellContent = '';
      }
    }
    rows.push([label, cellContent]);
  });
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabsBlock with the table
  tabsBlock.replaceWith(block);
}
