/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the provided element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Collect the tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Collect the tab contents: each tabpanel corresponds to a tab label
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  const tabContents = tabPanels.map(panel => {
    // Try to find all direct .contentfragment or article children for robust extraction
    const contentFragments = Array.from(panel.querySelectorAll(':scope > .contentfragment, :scope > article, :scope > .cmp-contentfragment'));
    if (contentFragments.length > 0) {
      return contentFragments.length === 1 ? contentFragments[0] : contentFragments;
    } else {
      // If none found, fallback to all direct children
      const directChildren = Array.from(panel.children);
      return directChildren.length === 1 ? directChildren[0] : directChildren;
    }
  });

  // Only build the tabs table if we have matching labels and contents
  if (!tabLabels.length || tabLabels.length !== tabContents.length) return;

  // Build the table: header row (single cell), then each tab in a row of two cells (label, content)
  const headerRow = ['Tabs (tabs20)'];
  const tableRows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    tableRows.push([
      tabLabels[i],
      tabContents[i]
    ]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the tabs block element with the new block table
  element.replaceWith(table);
}
