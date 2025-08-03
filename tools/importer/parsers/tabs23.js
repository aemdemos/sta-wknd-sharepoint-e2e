/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the block to replace)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Find all tabpanel elements for contents
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row should match exactly
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, extract label and its corresponding content element
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabelElement = tabLabels[i];
    const tabLabel = tabLabelElement ? tabLabelElement.textContent.trim() : '';

    // By default, match via aria-controls
    let contentPanel = null;
    if (tabLabelElement && tabLabelElement.hasAttribute('aria-controls')) {
      contentPanel = tabsBlock.querySelector(`#${tabLabelElement.getAttribute('aria-controls')}`);
    }
    // fallback: match by order
    if (!contentPanel && tabPanels[i]) {
      contentPanel = tabPanels[i];
    }

    // For the cell, the example prefers referencing the main content block in the tabpanel (e.g., article/contentfragment)
    // If not available, use the tabpanel itself
    let mainContent = null;
    if (contentPanel) {
      // Look for a main contentfragment/article (direct child)
      mainContent = contentPanel.querySelector('article.cmp-contentfragment, .cmp-contentfragment, .contentfragment, article');
      if (!mainContent) mainContent = contentPanel;
    }
    rows.push([tabLabel, mainContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
