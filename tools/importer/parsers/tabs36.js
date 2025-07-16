/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels in the order they appear
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row as a single cell (not as a <th> with multiple columns)
  const headerRow = ['Tabs (tabs36)'];

  // For each tab, create a row [Tab Label, Tab Content]
  const rows = tabItems.map((tab, idx) => {
    const label = tab.textContent.trim();
    const tabPanel = tabPanels[idx];
    let content;
    if (tabPanel) {
      // Create a fragment to hold the visible content of the tab
      const frag = document.createDocumentFragment();
      // We want the *inside* of the panel, not the outer attributes
      Array.from(tabPanel.childNodes).forEach((node) => {
        if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim() !== '')) {
          frag.appendChild(node);
        }
      });
      content = [frag];
    } else {
      content = [''];
    }
    return [label, content];
  });

  // Compose the table: header (1 cell), then 2-column rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
