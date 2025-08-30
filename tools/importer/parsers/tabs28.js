/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children).map(tab => tab.textContent.trim()) : [];

  // Get all tab panels in order of their appearance inside .cmp-tabs
  // Each panel corresponds to a tab label by order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare 2D cells array for the block table
  const rows = [];
  // Header row as per instructions
  rows.push(['Tabs (tabs28)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // Try to reference the main content block inside the tab panel
      // Usually the .cmp-contentfragment, otherwise all content
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // if .cmp-contentfragment is not present, collect all meaningful child nodes
        // Filter out empty text and empty .aem-Grid wrappers
        const kids = Array.from(panel.childNodes).filter(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim().length > 0;
          }
          if (node.nodeType === Node.ELEMENT_NODE) {
            // skip empty grid wrappers
            if (node.classList.contains('aem-Grid') || node.classList.contains('aem-Grid--12')) {
              return node.textContent.trim().length > 0;
            }
            return true;
          }
          return false;
        });
        contentCell = (kids.length === 1) ? kids[0] : kids;
      }
    } else {
      // If no panel, fallback to empty string
      contentCell = '';
    }
    rows.push([label, contentCell]);
  }

  // Build the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the element
  element.replaceWith(block);
}
