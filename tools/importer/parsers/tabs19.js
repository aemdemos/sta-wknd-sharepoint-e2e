/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tabs container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();

    // Tab panel content
    const panelEl = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panelEl) return;

    // For resilience, grab the entire panel content
    // Usually, the content is inside a .contentfragment > article
    let tabContent;
    const contentFragment = panelEl.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panelEl;
    }

    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
