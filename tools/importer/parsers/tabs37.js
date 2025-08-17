/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Tabs header row
  const rows = [['Tabs (tabs37)']];

  // Get the tab labels (li elements)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tabpanels (content for each tab)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // For each tab, create a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const panelEl = tabPanels[i];
    // Defensive: default content to empty string if not found
    let panelContent = '';
    if (panelEl) {
      // If the tabpanel has only one child, use it. Otherwise use all children.
      if (panelEl.children.length === 1) {
        panelContent = panelEl.children[0];
      } else if (panelEl.children.length > 1) {
        panelContent = Array.from(panelEl.children);
      }
    }
    rows.push([labelEl, panelContent]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
