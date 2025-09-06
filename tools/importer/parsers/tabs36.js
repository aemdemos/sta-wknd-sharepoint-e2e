/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element.classList.contains('tabs')) return;

  // Table header row must match block name
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels in order
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure tab count matches
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;
    // Use the panel's innerHTML as a fragment so the DOM isn't moved
    const fragment = document.createElement('div');
    fragment.innerHTML = panel.innerHTML;
    rows.push([label, fragment]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
