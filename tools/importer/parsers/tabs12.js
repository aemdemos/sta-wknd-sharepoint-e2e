/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels (li[role=tab]) in order
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];

  // Get the tab panels (div[data-cmp-hook-tabs=tabpanel]) in order
  const tabPanelEls = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Edge case: If there are no tabs or panels, do nothing
  if (tabLabelEls.length === 0 || tabPanelEls.length === 0) return;

  // Build the header row: always exactly 'Tabs (tabs12)'
  const rows = [['Tabs (tabs12)']];

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabLabelEls.length; i++) {
    const tabLabelEl = tabLabelEls[i];
    const label = tabLabelEl ? tabLabelEl.textContent.trim() : '';
    // If no panel, skip row
    if (!tabPanelEls[i]) continue;
    const panelEl = tabPanelEls[i];

    // For semantic fidelity, reference the entire .contentfragment or article within the panel if it exists, else the panel itself
    const mainContent = panelEl.querySelector('article') || panelEl.querySelector('.contentfragment') || panelEl;
    // For label, use a <strong> element for robust direct referencing (not string)
    const strongLabel = document.createElement('strong');
    strongLabel.textContent = label;
    rows.push([strongLabel, mainContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block only (not the root element)
  cmpTabs.parentNode.replaceChild(block, cmpTabs);
}
