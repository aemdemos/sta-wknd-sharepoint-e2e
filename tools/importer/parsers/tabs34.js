/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the passed element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from tablist
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.children : []);
  const tabLabels = tabItems.map(li => li.textContent.trim());

  // Get tab panels by their role and class (order matches tablist)
  const tabPanels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose header row: block name (per instructions)
  const headerRow = ['Tabs (tabs34)'];

  // For each tab: label and its content (the tabpanel element)
  // Reference the actual tabpanel node, not innerHTML or clones
  const rows = tabLabels.map((label, idx) => {
    let panel = tabPanels[idx];
    // If tab count mismatches panel count, fallback to matching aria-labelledby
    if (!panel) {
      const tabId = tabItems[idx] && tabItems[idx].id;
      panel = Array.from(tabPanels).find(tp => tp.getAttribute('aria-labelledby') === tabId);
    }
    // Defensive: if still missing, create empty cell
    if (!panel) {
      panel = document.createElement('div');
    }
    return [label, panel];
  });

  // Build table rows
  const cells = [headerRow, ...rows];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace only the tabs element in the DOM
  tabsEl.parentNode.replaceChild(block, tabsEl);
}
