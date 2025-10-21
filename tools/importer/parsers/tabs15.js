/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab headers (tab titles)
  const tabHeaders = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (tab contents)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure equal number of headers and panels
  if (tabHeaders.length !== tabPanels.length) {
    // fallback: skip if mismatch
    return;
  }

  // Table header row
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // For each tab, create a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabHeaders.length; i++) {
    const tabLabel = tabHeaders[i].textContent.trim();
    const tabPanel = tabPanels[i];

    // Defensive: find the main content fragment inside the panel
    let tabContent = null;
    // Try to find a contentfragment/article inside the tabPanel
    const cf = tabPanel.querySelector('article.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: use the tabPanel itself
      tabContent = tabPanel;
    }

    rows.push([tabLabel, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
