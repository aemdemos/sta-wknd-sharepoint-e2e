/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs navigation (tab labels)
  const tabsNav = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabsNav) return;
  const tabLabels = Array.from(tabsNav.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Find all tab panels (content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // Reference the actual content element from the DOM (do not clone)
    // Find the main contentfragment/article inside the panel
    let tabContent = panel.querySelector('article') || panel;
    rows.push([label, tabContent]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(blockTable);
}
