/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if we have matching tabs and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row as required
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel (content)
    const panel = tabPanels[i];
    if (!panel) return;

    // Defensive: Find the contentfragment inside the panel
    const cf = panel.querySelector('.contentfragment');
    let tabContent;
    if (cf) {
      // Use the contentfragment article as the tab content
      const article = cf.querySelector('article');
      tabContent = article ? article : cf;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }

    // Add row: [Tab Label, Tab Content]
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
