/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.classList.contains('cmp-tabs') ? tabsBlock : tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then each tab
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Find the main content inside the tab panel
    let tabContent = null;
    // Prefer .contentfragment or article.cmp-contentfragment
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
