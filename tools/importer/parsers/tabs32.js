/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels from the tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels in the order they appear
  const tabPanels = [];
  tabsContainer.querySelectorAll('[role="tabpanel"]').forEach(panel => {
    // For robustness, gather all children of the panel
    const frag = document.createDocumentFragment();
    // Move children from panel to frag, preserving reference (don't clone)
    while (panel.firstChild) {
      frag.appendChild(panel.firstChild);
    }
    tabPanels.push(frag);
  });

  // Validate label-panel match
  if (tabLabels.length !== tabPanels.length) {
    // If mismatch, fallback to returning without action
    return;
  }

  // Compose the block table: header, then one row per tab
  const headerRow = ['Tabs (tabs32)'];
  const cells = [headerRow];
  for (let i = 0; i < tabLabels.length; i += 1) {
    cells.push([
      tabLabels[i],
      tabPanels[i],
    ]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the full tabsContainer with the generated block
  tabsContainer.replaceWith(block);
}
