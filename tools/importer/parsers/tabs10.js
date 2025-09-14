/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build rows: header first
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Defensive: get label text
    const labelText = labelEl.textContent.trim();

    // Defensive: get panel content
    const panelEl = tabPanels[idx];
    // For robustness, use the whole panel content
    // Find the main contentfragment/article inside panel
    let tabContent = null;
    const contentFragment = panelEl.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panelEl;
    }

    rows.push([labelText, tabContent]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original tabs block with the table
  tabsBlock.replaceWith(table);
}
