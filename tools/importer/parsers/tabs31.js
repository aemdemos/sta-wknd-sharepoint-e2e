/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only continue if we have matching labels and panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Table header row: must match block name exactly
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[idx];
    if (!panel) return;

    // Extract the tab content: use the .cmp-contentfragment if present, otherwise all children
    let tabContent;
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // If no contentfragment, use all child nodes
      tabContent = Array.from(panel.childNodes);
    }

    // Defensive: If tabContent is empty, use an empty string
    if (!tabContent || (Array.isArray(tabContent) && tabContent.length === 0)) {
      tabContent = '';
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
