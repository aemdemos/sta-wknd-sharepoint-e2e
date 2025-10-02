/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row: must match target block name exactly
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, idx) => {
    // Defensive: handle missing panel
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;

    // Get tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: reference the main article/contentfragment inside the tabpanel
    let tabContent = tabPanel.querySelector('article.cmp-contentfragment');
    if (!tabContent) {
      // fallback: use the tabPanel itself
      tabContent = tabPanel;
    }

    // Defensive: if tabContent is empty, skip
    if (!tabContent.textContent.trim()) return;

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block
  tabsBlock.replaceWith(block);
}
