/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the element
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract the tab labels
  const tabList = cmpTabs.querySelector('ol[role="tablist"], ul[role="tablist"]');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.children);
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Extract the tab contents (panel for each tab)
  // Panels may not be in the same order as tabs, so we use the aria-controls/id linkage.
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));

  // Map aria attributes to their elements for reliable lookup
  const panelsById = {};
  tabPanels.forEach(panel => {
    panelsById[panel.id] = panel;
  });

  // Each label <li> has aria-controls=panelId
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];
  for (const labelEl of tabLabelEls) {
    const label = labelEl.textContent.trim();
    const panelId = labelEl.getAttribute('aria-controls');
    let content = null;
    if (panelId && panelsById[panelId]) {
      // Always use the main contentfragment/article if found, otherwise the full panel
      const panel = panelsById[panelId];
      const contentFragment = panel.querySelector('.contentfragment') || panel;
      content = contentFragment;
    } else {
      // Fallback: just label in first cell, empty in second
      content = document.createElement('div');
    }
    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.replaceWith(table);
}
