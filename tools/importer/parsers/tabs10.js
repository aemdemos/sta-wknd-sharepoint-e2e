/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get all tab labels in the correct order
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li.cmp-tabs__tab'));
  const tabLabels = tabLabelEls.map(labelEl => labelEl.textContent.trim());

  // Get all tab panels in the correct order
  let tabPanels = Array.from(
    tabsEl.querySelectorAll(':scope > [data-cmp-hook-tabs="tabpanel"]')
  );
  // Fallback if not direct children
  if (tabPanels.length === 0) {
    tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  }

  // Defensive: match tabs and contents by order
  const numTabs = Math.min(tabLabels.length, tabPanels.length);
  const tabContentCells = [];
  for (let i = 0; i < numTabs; i++) {
    const panel = tabPanels[i];
    // Extract relevant content nodes (reference article/contentfragment or all children)
    const contentNodes = Array.from(panel.childNodes).filter(n => {
      if (n.nodeType === 1) return true;
      if (n.nodeType === 3 && n.textContent.trim().length > 0) return true;
      return false;
    });
    if (contentNodes.length === 1) {
      tabContentCells.push(contentNodes[0]);
    } else if (contentNodes.length > 1) {
      tabContentCells.push(contentNodes);
    } else {
      // fallback: empty div
      tabContentCells.push(document.createElement('div'));
    }
  }

  // Structure: first row is header, second row is tab labels (all columns), third row is tab content (all columns)
  const cells = [
    ['Tabs (tabs10)'],
    tabLabels,
    tabContentCells
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
