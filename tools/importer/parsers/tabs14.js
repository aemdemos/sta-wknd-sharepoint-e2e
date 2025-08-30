/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs) within the incoming element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels from the tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabLabels.push(...Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim()));
  }

  // Extract tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Header row as specified: EXACT block name
  const headerRow = ['Tabs (tabs14)'];

  // Build the rows for each tab: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, idx) => {
    // Find corresponding tab panel
    const panel = tabPanels[idx];
    if (!panel) return [label, ''];

    // Most tab panels contain a single <article> block
    const article = panel.querySelector('article');
    if (article) {
      return [label, article];
    } else {
      // If no article, use panel content directly (should be rare)
      // Only reference the panel if not empty
      if (panel.childNodes.length > 0) {
        return [label, panel];
      } else {
        return [label, ''];
      }
    }
  });

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the table using the helper
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new blockTable (preserving reference semantics)
  tabsRoot.parentNode.replaceChild(blockTable, tabsRoot);
}
