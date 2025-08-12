/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (tabLabelEls.length === 0) return;
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // For each tab label, find its corresponding tabpanel for the correct order
  const tabPanels = tabLabelEls.map(tabEl => {
    const controlsId = tabEl.getAttribute('aria-controls');
    if (!controlsId) return '';
    const tabPanel = tabsRoot.querySelector(`#${controlsId}`);
    return tabPanel || '';
  });

  // Build the rows for the block table as per the specification:
  // 1. Header row (single cell)
  // 2. Tab labels row (one cell per tab)
  // 3. Tab content row (one cell per tab, referencing panel elements)
  const cells = [
    ['Tabs (tabs31)'],
    tabLabels,
    tabPanels
  ];

  // Create block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
