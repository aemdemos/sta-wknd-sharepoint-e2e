/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children matching selector
  function getChildrenBySelector(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Find the tabs block root
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the actual tabs component
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    // Defensive: skip if panel missing
    if (!panel) return;

    // Tab content: grab everything inside the tabpanel
    // We'll use the first direct child of tabpanel (usually .contentfragment)
    let tabContentEl = null;
    const children = getChildrenBySelector(panel, '*');
    if (children.length > 0) {
      tabContentEl = children[0];
    } else {
      // fallback: use panel itself
      tabContentEl = panel;
    }
    // Defensive: if it's empty, skip
    if (!tabContentEl || (tabContentEl.textContent.trim() === '' && !tabContentEl.querySelector('img'))) return;

    rows.push([label, tabContentEl]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsContainer with the block
  tabsContainer.replaceWith(block);
}
