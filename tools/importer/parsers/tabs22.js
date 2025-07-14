/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements inside .cmp-tabs__tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (each .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows: header row, then one row per tab (label, content)
  const rows = [];
  // Header row: must match the required block name
  rows.push(['Tabs (tabs22)']);

  // For each tab, get label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // The content panel for a tab is determined by aria-labelledby === label.id
    let contentPanel = tabPanels.find(panel => {
      const labelledBy = panel.getAttribute('aria-labelledby');
      return labelledBy === tabLabels[i].id;
    });
    // Fallback if not found
    if (!contentPanel && tabPanels[i]) contentPanel = tabPanels[i];

    let tabContent = null;
    if (contentPanel) {
      // Find the main content inside each tab panel
      // Try to find the first '.contentfragment > article', else first child div
      let article = contentPanel.querySelector('article');
      if (article) {
        tabContent = article;
      } else {
        // Fallback to first div (e.g., .contentfragment)
        let cf = contentPanel.querySelector('.contentfragment');
        if (cf) {
          tabContent = cf;
        } else {
          // Fallback to the panel itself (rare edge case)
          tabContent = contentPanel;
        }
      }
    }
    // If not found, fallback to empty cell, but always add the row
    rows.push([label, tabContent ? tabContent : '']);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
