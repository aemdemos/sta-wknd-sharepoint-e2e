/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the Tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Collect tab labels
  const tabList = tabs.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li.cmp-tabs__tab')) : [];

  // Collect tab panels (order matters)
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Safety check: require matching number of tabs and panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build table rows
  // Header row: block name
  const rows = [['Tabs (tabs38)']];

  // Row of tab labels
  const labelsRow = tabLabels.map(labelEl => labelEl.textContent.trim());
  rows.push(labelsRow);

  // Row of tab content elements
  const contentsRow = tabPanels.map(panel => {
    // Prefer the .contentfragment within the panel if present
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      return contentFragment;
    }
    // Otherwise, return the panel itself (after cleaning attributes)
    panel.removeAttribute('role');
    panel.removeAttribute('aria-labelledby');
    panel.removeAttribute('tabindex');
    panel.removeAttribute('data-cmp-hook-tabs');
    panel.removeAttribute('data-cmp-data-layer');
    panel.removeAttribute('aria-hidden');
    return panel;
  });
  rows.push(contentsRow);

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
