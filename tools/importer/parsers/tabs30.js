/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get tab content panels (make sure order matches tabLabels)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose rows for block table
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  tabLabels.forEach((tabLabel, idx) => {
    const labelText = tabLabel.textContent.trim();
    // Defensive: if panel not found, skip
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;
    // Usually, the useful content is a .contentfragment inside tabPanel
    let tabContent = tabPanel.querySelector('.contentfragment');
    if (!tabContent) {
      // If not found, use tabPanel itself
      tabContent = tabPanel;
    }
    rows.push([labelText, tabContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabsContainer with the table
  tabsContainer.replaceWith(block);
}
