/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (tabsContainer && tabsContainer.querySelector('.cmp-tabs')) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // Build rows for each tab
  tabLabels.forEach((labelEl, idx) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();
    // Tab panel content
    const panel = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panel) return;
    // For robustness, use the entire tab panel as the content cell
    rows.push([tabLabel, panel]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
