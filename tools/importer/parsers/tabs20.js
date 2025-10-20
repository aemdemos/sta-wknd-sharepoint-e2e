/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer');
  if (!tabsContainer) return;

  // Find the tab navigation (tab headers)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabHeaders = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: If no tabs, abort
  if (!tabHeaders.length || !tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabHeaders.forEach((tabHeader, idx) => {
    // Tab label text
    const label = tabHeader.textContent.trim();

    // Find corresponding tab panel by index (order matches)
    const panel = tabPanels[idx];
    if (!panel) return;

    // Defensive: Get only the content fragment inside the panel
    // This should capture all rich content, images, etc.
    let tabContent = null;
    // Prefer the contentfragment/article if present
    tabContent = panel.querySelector('.cmp-contentfragment, article') || panel;

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(block);
}
