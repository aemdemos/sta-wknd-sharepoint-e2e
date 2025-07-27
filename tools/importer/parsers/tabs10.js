/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content areas)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row must match the block info exactly
  const headerRow = ['Tabs (tabs10)'];
  const rows = [];

  // For each tab, extract label and its content
  tabLabels.forEach((labelEl) => {
    // Extract the aria-controls to match the tabpanel
    const controls = labelEl.getAttribute('aria-controls');
    let contentCell = '';
    let matchedPanel = null;
    for (const panel of tabPanels) {
      if (panel.id === controls) {
        matchedPanel = panel;
        break;
      }
    }
    if (matchedPanel) {
      // Gather all direct children of the panel for resiliency
      const cellContent = [];
      Array.from(matchedPanel.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          cellContent.push(node);
        }
      });
      // Use a single element if possible
      contentCell = cellContent.length === 1 ? cellContent[0] : cellContent;
    }
    rows.push([labelEl.textContent.trim(), contentCell]);
  });

  // Only proceed if we have at least one valid tab and panel
  if (rows.length) {
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
