/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs (tab navigation and panels)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;

  // Get tab labels from tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure same number of tabs and panels
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Table header
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  for (let i = 0; i < count; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Tab label: use textContent
    const tabTitle = label.textContent.trim();

    // Tab content: find main content fragment inside panel
    let tabContent = null;
    // Try to find the main content fragment/article
    const cf = panel.querySelector('article.cmp-contentfragment') || panel;
    // For robustness, use the whole content fragment (including images, lists, etc)
    tabContent = cf.cloneNode(true);

    rows.push([tabTitle, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsRoot.replaceWith(block);
}
