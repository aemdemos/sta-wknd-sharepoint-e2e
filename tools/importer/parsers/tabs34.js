/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container inside the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab label elements (li elements inside the tablist)
  const tabLabelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  const tabLabels = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // Get all tab panel elements (divs with [data-cmp-hook-tabs="tabpanel"])
  const tabPanelEls = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabLabels.length !== tabPanelEls.length || tabLabels.length === 0) return;

  // Header row for the block
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];

  // Each row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    // Find the main content inside the panel
    // Prefer .contentfragment or article, fallback to panel itself
    let tabContent = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (!tabContent) {
      // If no fragment, reference the tabpanel div itself (may rarely happen)
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
