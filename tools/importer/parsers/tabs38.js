/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabs = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabs) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabs.querySelector('.cmp-tabs') || tabs;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tabpanel elements (one per tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header (must match block name exactly)
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Use the entire tabpanel content as the cell (preserving all HTML and structure)
      // Remove aria attributes and classes that are not needed for content
      const panelClone = panel.cloneNode(true);
      // Remove tabpanel-specific attributes/classes
      panelClone.removeAttribute('role');
      panelClone.removeAttribute('aria-labelledby');
      panelClone.removeAttribute('tabindex');
      panelClone.removeAttribute('data-cmp-hook-tabs');
      panelClone.removeAttribute('aria-hidden');
      panelClone.classList.remove('cmp-tabs__tabpanel', 'cmp-tabs__tabpanel--active');
      content = panelClone;
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block
  tabs.replaceWith(block);
}
