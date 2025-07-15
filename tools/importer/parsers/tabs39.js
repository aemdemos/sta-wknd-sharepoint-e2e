/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (in order)
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelElements = tablist ? tablist.querySelectorAll('li') : [];
  const tabLabels = Array.from(tabLabelElements).map(li => li.textContent.trim());

  // Get all tab panels (in order)
  const tabPanelElements = tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Each tab's content cell
  // For each tab panel, extract the primary content area (usually article)
  const tabContents = Array.from(tabPanelElements).map(panel => {
    // Try to find a .contentfragment > article or just .contentfragment
    let mainContent = panel.querySelector('article');
    if (!mainContent) {
      mainContent = panel.querySelector('.contentfragment');
    }
    // If neither found, fallback to the panel itself
    if (!mainContent) {
      mainContent = panel;
    }
    return mainContent;
  });

  // Table structure
  // Row 1: header
  // Row 2: tab labels (each in their own cell)
  // Row 3: the tab contents (each in their own cell)
  const headerRow = ['Tabs (tabs39)'];
  const cells = [
    headerRow,
    tabLabels,
    tabContents,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
