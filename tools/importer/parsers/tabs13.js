/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block in this section
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.children).filter(li => li && li.textContent && li.getAttribute('role') === 'tab');
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Get all tab panels (content), only direct children of .cmp-tabs
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll(':scope > div[data-cmp-hook-tabs="tabpanel"]')
  );
  // Defensive: Only process up to the minimum count of tabs and panels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Compose the block table rows
  // Header row: single cell (block name)
  const rows = [ ['Tabs (tabs13)'] ];
  // Subsequent rows: two cells (tab label, tab content)
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Prefer .contentfragment for cell content if present
    const contentFragment = panel.querySelector('.contentfragment');
    let cellContent = contentFragment ? contentFragment : panel;
    rows.push([label, cellContent]);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
