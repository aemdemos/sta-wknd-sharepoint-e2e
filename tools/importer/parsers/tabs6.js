/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and their corresponding panels in order
  const tabLabelNodes = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabLabels = tabLabelNodes.map(li => li.textContent.trim());

  // Map each tab label to its corresponding tabpanel element
  const tabPanelNodes = tabLabelNodes.map(li => {
    // Each li[aria-controls] points to the tabpanel id
    const controls = li.getAttribute('aria-controls');
    if (!controls) return null;
    // The tabpanel id is typically '{tablist-id}-item-xxxxxx-tabpanel'
    const tabPanel = tabsBlock.querySelector(`#${controls}`);
    return tabPanel;
  });

  // Table header row: must match exactly
  const headerRow = ['Tabs (tabs6)'];
  const tableRows = [headerRow];

  // Each row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanelNodes[i];
    let content = '';
    if (tabPanel) {
      // Try to find the main content for the tab; prefer the main article or direct block
      // The structure usually is: .contentfragment -> article -> ...
      // But if not present, use the panel content directly
      let mainContent = tabPanel.querySelector('article') || tabPanel.querySelector('.contentfragment') || tabPanel;
      content = mainContent;
    }
    tableRows.push([label, content]);
  }

  // Create the tab block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the tabs block in the DOM with the new table
  tabsBlock.replaceWith(table);
}
