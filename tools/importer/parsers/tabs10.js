/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(tab => tab.textContent.trim());
  }

  // Extract tab contents corresponding to each tab
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  const tabContents = tabPanels.map(panel => {
    // For resiliency, use all children (not just contentfragment) in each tab panel
    // Some contentfragments are wrapped in extra divs
    // Want to preserve all visible content
    const children = Array.from(panel.children);
    if (children.length === 1) {
      return children[0];
    }
    // If multiple, return all as array
    return children;
  });

  // Header row as per spec
  const headerRow = ['Tabs (tabs10)'];
  // Next row: tab labels
  // Next row: tab contents
  // The table should have two columns and multiple rows: first row header, then one row per tab
  // But example markdown structure is: header (single cell), then each tab is a row with two cells (label, content)
  // So reconstruct rows accordingly

  const cells = [headerRow];
  // Now rows: each [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Prefer referencing the existing element(s) from the document
    let contentCell = tabContents[i];
    // Defensive: if empty, use blank string
    if (!contentCell || (Array.isArray(contentCell) && contentCell.length === 0)) {
      contentCell = '';
    }
    cells.push([tabLabels[i], contentCell]);
  }

  // Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
