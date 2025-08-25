/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (from <li> in tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);
  const tabLabels = tabItems.map(tab => tab.textContent.trim());

  // Find all tabpanels in the correct order
  const tabPanels = tabItems.map(tab => {
    // The aria-controls attribute points to the panel id
    const panelId = tab.getAttribute('aria-controls');
    if (!panelId) return null;
    return tabsBlock.querySelector(`#${panelId}`);
  });

  // Build header row (must match example exactly)
  const headerRow = ['Tabs (tabs37)'];
  const rows = [];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Reference the main content for this tab
    // Usually a .contentfragment, fallback to the panel itself
    let tabContent = panel.querySelector('.contentfragment');
    if (!tabContent) {
      // If no contentfragment, reference the panel directly
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Only create the block if there is at least one tab
  if (rows.length === 0) return;

  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
