/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLabelElements.map(tabEl => tabEl.textContent.trim());

  // Get tab panels in the same order as labels (rely on DOM order)
  // Only direct children of the tabs block of class cmp-tabs__tabpanel
  const tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > .cmp-tabs__tabpanel'));
  // If not found, fallback to all tabpanels inside
  const panels = tabPanels.length
    ? tabPanels
    : Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // The number/order of tab labels and tab panels must match
  // Sometimes, panels may not be direct children. We rely on order.
  // If lengths don't match, handle gracefully
  const minLen = Math.min(tabLabels.length, panels.length);
  const effectiveLabels = tabLabels.slice(0, minLen);
  const effectivePanels = panels.slice(0, minLen);

  // Build the table rows
  const headerRow = ['Tabs (tabs11)'];
  const labelRow = effectiveLabels;
  const contentRow = effectivePanels.map(panel => {
    // Panel often contains a .contentfragment block, if so, that's the main content
    const mainContent = panel.querySelector('.contentfragment') || panel;
    return mainContent;
  });

  const cells = [headerRow, labelRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
