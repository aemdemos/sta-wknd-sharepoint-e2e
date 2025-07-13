/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the one with .cmp-tabs)
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (each tab's content)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build table cells array
  // Header row: single cell, not two
  const headerRow = ['Tabs (tabs6)'];
  const rows = [headerRow];

  // Each row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const panel = tabPanels[i];
    if (!panel) continue;

    // Content: include all child nodes (block reference)
    let contentNodes = Array.from(panel.childNodes).filter(n => {
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim() !== '';
      return true;
    });
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else if (contentNodes.length > 1) {
      content = contentNodes;
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  // Create table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the entire tabs block with the table
  tabsBlock.replaceWith(table);
}
