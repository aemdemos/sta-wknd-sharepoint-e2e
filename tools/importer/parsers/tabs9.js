/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the actual tabs block
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Header row
  const headerRow = ['Tabs (tabs9)'];

  // Build rows: each tab label and its content
  const rows = tabLabels.map((labelEl, idx) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();

    // Tab panel content (grab the contentfragment/article inside)
    const panel = tabPanels[idx];
    let tabContent;
    // Try to find the main contentfragment/article
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    return [tabLabel, tabContent];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original tabsContainer with the block
  tabsContainer.replaceWith(block);
}
