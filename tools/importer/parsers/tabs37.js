/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs root within the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels from the tab list
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];

  // Retrieve the tab content panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows
  const rows = [];
  // Header row: use the block name as specified
  rows.push(['Tabs (tabs37)']);

  for (let i = 0; i < tabLabelEls.length; i++) {
    const labelEl = tabLabelEls[i];
    const label = labelEl ? labelEl.textContent.trim() : '';
    let panel = tabPanels[i];
    // Find the tab panel by aria-labelledby if available for resilience
    if (labelEl && labelEl.id) {
      const match = tabPanels.find(
        p => p.getAttribute('aria-labelledby') === labelEl.id
      );
      if (match) panel = match;
    }
    // For tab content, use the main .contentfragment/article within panel, fallback to panel
    let tabContent = null;
    if (panel) {
      let mainContent = panel.querySelector('.contentfragment');
      if (!mainContent) mainContent = panel.querySelector('article');
      tabContent = mainContent || panel;
    }
    // Only include if label and content present (defensive)
    if (label && tabContent) {
      rows.push([label, tabContent]);
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsRoot in the DOM with the new table
  tabsRoot.replaceWith(table);
}
