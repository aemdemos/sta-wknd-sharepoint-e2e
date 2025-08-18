/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 1. Get all tab labels in order
  const tabLabelNodes = tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]');
  const tabLabels = Array.from(tabLabelNodes).map(tab => tab.textContent.trim());

  // 2. Get all tab panels in order
  const tabPanels = tabsBlock.querySelectorAll('[role="tabpanel"]');

  // 3. Build the table
  const cells = [];
  // Header row must match example exactly
  cells.push(['Tabs (tabs36)']);

  // Defensive: tabs and panels should have matching length
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Reference the panel element directly; it contains all content/substructure
    cells.push([label, panel]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original block
  tabsBlock.replaceWith(block);
}
