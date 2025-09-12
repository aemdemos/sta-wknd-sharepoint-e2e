/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs22)'];

  // Build rows for each tab
  const rows = tabLabels.map((label, i) => {
    // Tab label cell (string)
    const tabLabelCell = label;
    // Tab content cell (element):
    // Use the entire tabPanel content for resilience
    const tabPanel = tabPanels[i];
    // Defensive: Some tabPanels wrap content in a single child div
    let tabContent;
    // Find the main contentfragment/article inside the tabPanel
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use tabPanel itself
      tabContent = tabPanel;
    }
    return [tabLabelCell, tabContent];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs container with the block table
  tabsContainer.replaceWith(block);
}
