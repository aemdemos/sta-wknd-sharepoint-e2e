/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Header row as per block requirements
  const headerRow = ['Tabs (tabs7)'];

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure same number of labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < numTabs; i++) {
    // Use the text content of the tab label
    const label = tabLabels[i]?.textContent?.trim() || '';
    // For content, use the entire tab panel's content (not the panel itself, just its children)
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Gather all direct children of the panel
      const children = Array.from(panel.childNodes).filter(n => {
        // Filter out empty text nodes
        if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
        return true;
      });
      // If only one child, use it directly, else use array
      content = children.length === 1 ? children[0] : children;
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
