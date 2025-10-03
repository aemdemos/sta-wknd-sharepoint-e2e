/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from each tabpanel
  function extractTabs(tabsContainer) {
    const tabs = [];
    // Get tab labels
    const tabLabels = Array.from(
      tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
    ).map(tab => tab.textContent.trim());
    // Get tab panels (content)
    const tabPanels = Array.from(
      tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
    );
    // Defensive: match labels to panels
    for (let i = 0; i < tabLabels.length; i++) {
      const label = tabLabels[i];
      const panel = tabPanels[i];
      let content = null;
      if (panel) {
        // Use the contentfragment/article inside panel for rich content
        const contentFragment = panel.querySelector('article') || panel;
        content = contentFragment;
      } else {
        // Fallback: empty div
        content = document.createElement('div');
      }
      tabs.push([label, content]);
    }
    return tabs;
  }

  // Find the tabs block in the source element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Build table rows
  const headerRow = ['Tabs (tabs23)'];
  const tabRows = extractTabs(tabsBlock);

  // Compose table data
  const tableData = [headerRow, ...tabRows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
