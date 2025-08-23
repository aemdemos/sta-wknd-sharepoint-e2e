/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container by class 'cmp-tabs' (inside the provided element)
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels (li's inside .cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tab panels (divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: match tabPanels to tabLabels by aria-controls/id
  // This ensures correct pairing even if order is off
  const panelMap = {};
  tabPanels.forEach(panel => {
    const panelId = panel.getAttribute('id');
    panelMap[panelId] = panel;
  });

  // First row: block name, matching example
  const headerRow = ["Tabs (tabs20)"];
  // Build the table data
  const rows = [headerRow];

  tabLabels.forEach(tabLabelEl => {
    // Tab label text
    const tabLabel = tabLabelEl.textContent.trim();
    // Find the corresponding tabpanel by aria-controls
    const panelId = tabLabelEl.getAttribute('aria-controls');
    const tabPanel = panelMap[panelId];
    let tabContent;
    if (tabPanel) {
      // Prefer .contentfragment or .cmp-contentfragment__elements within tabPanel
      const contentFragment = tabPanel.querySelector('.contentfragment, article.cmp-contentfragment, .cmp-contentfragment__elements');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // Fallback: all children of tabPanel
        tabContent = document.createElement('div');
        Array.from(tabPanel.childNodes).forEach(child => tabContent.appendChild(child));
      }
    } else {
      // If no panel, use empty string
      tabContent = '';
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
