/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the list of tab labels in order
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get all tabpanel containers, which should be in order matching the tabs
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build the cells array for createTable
  const cells = [];

  // Header row - must match block name exactly
  cells.push(['Tabs (tabs6)']);

  // For each tab, get label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Try to find the most meaningful content node inside the panel
      // Prefer .contentfragment or article, otherwise use panel itself
      content = panel.querySelector('.contentfragment') || panel.querySelector('article') || panel;
    } else {
      // If missing, keep cell empty
      content = '';
    }
    cells.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
