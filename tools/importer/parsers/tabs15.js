/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Find the tab panels in DOM order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Only use tabs/panels that have a match
  const usedTabLabels = tabLabels.slice(0, tabCount);
  const usedTabPanels = tabPanels.slice(0, tabCount);

  // Header row: single cell
  const headerRow = ['Tabs (tabs15)'];
  // Label row: one per tab, as columns
  const labelRow = usedTabLabels;
  // Each subsequent row: 2 columns [tab label, tab content]
  const contentRows = usedTabLabels.map((label, i) => {
    const panel = usedTabPanels[i];
    // Prefer main content block (article), else the panel
    const mainContent = panel.querySelector('article') || panel;
    return [label, mainContent];
  });

  // Assemble the table
  const rows = [headerRow, labelRow, ...contentRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(table);
}
