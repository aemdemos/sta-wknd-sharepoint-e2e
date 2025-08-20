/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels in order from .cmp-tabs__tablist
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels in DOM order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Create array for table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs34)']);

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Find the main content block of the tab (usually the article inside the panel)
    let tabContent = null;
    // Prefer existing .contentfragment or .cmp-contentfragment (reference, not clone)
    tabContent = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (!tabContent) {
      // fallback: reference the panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
