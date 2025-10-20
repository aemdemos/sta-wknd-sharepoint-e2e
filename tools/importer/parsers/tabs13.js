/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (robust selector)
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Find tab headers (labels)
  const tabList = tabsContainer.querySelector('[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Find tab panels (contents)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process if labels and panels count match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header must match block name exactly
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    const labelText = tabLabel.textContent.trim();
    const panel = tabPanels[i];
    if (!panel) return;

    // Extract the main content for the tab
    // Find the first contentfragment/article or fallback to panel
    let tabContent = panel.querySelector('article') || panel.querySelector('.cmp-contentfragment') || panel;

    // Place the label and content in the row
    rows.push([
      labelText,
      tabContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs container with the block table
  tabsContainer.replaceWith(block);
}
