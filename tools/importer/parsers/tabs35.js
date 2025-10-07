/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (by class)
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  const cmpTabs = tabsRoot || element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (one per tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
