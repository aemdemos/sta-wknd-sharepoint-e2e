/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate on the tabs block
  if (!element.classList.contains('tabs')) return;

  // Block header row as per requirements
  const headerRow = ['Tabs (tabs27)'];
  const rows = [headerRow];

  // Find the tabs root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels in order
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Use innerHTML to preserve all content
    const tabContent = document.createElement('div');
    tabContent.innerHTML = panel.innerHTML;

    // Add row: [label, content]
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
