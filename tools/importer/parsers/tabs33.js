/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure equal count
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[i];
    if (!panel) return;
    // Find the contentfragment/article inside the panel
    const contentFragment = panel.querySelector('article') || panel;
    rows.push([
      labelText,
      contentFragment
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
