/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all tab panels and their labels
  function getTabsAndPanels(tabsContainer) {
    const tabLabels = [];
    const tabContents = [];
    // Get the tab list
    const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
    if (!tabList) return { tabLabels, tabContents };
    const tabItems = Array.from(tabList.querySelectorAll('[role="tab"]'));
    // Get all tab panels
    const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));
    // Defensive: tabPanels may not be in same order as tabItems, but usually are
    tabItems.forEach((tabItem, i) => {
      // Tab label text
      tabLabels.push(tabItem.textContent.trim());
      // Tab content: find panel by aria-controls or by order
      let panel = null;
      const panelId = tabItem.getAttribute('aria-controls');
      if (panelId) {
        panel = tabsContainer.querySelector(`#${panelId}`);
      }
      if (!panel && tabPanels[i]) {
        panel = tabPanels[i];
      }
      tabContents.push(panel);
    });
    return { tabLabels, tabContents };
  }

  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  const { tabLabels, tabContents } = getTabsAndPanels(tabsBlock);
  if (!tabLabels.length || !tabContents.length) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  tabLabels.forEach((label, i) => {
    // Defensive: if no content, skip
    const contentPanel = tabContents[i];
    if (!contentPanel) return;
    // Tab label cell
    const labelCell = label;
    // Tab content cell: use the actual content fragment/article inside panel
    // Defensive: find the main content fragment/article inside the panel
    let contentCell = null;
    // Prefer the .cmp-contentfragment inside panel
    const contentFragment = contentPanel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      contentCell = contentFragment;
    } else {
      // Fallback: use panel itself
      contentCell = contentPanel;
    }
    rows.push([labelCell, contentCell]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(blockTable);
}
