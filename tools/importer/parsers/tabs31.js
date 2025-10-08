/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs, .panelcontainer');
  if (!tabsBlock) return;

  // Find the tab navigation (tab labels)
  const tabsNav = tabsBlock.querySelector('[role="tablist"], .cmp-tabs__tablist');
  if (!tabsNav) return;
  const tabLabels = Array.from(tabsNav.querySelectorAll('[role="tab"], .cmp-tabs__tab'));

  // Find all tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];

    // Defensive: skip if missing
    if (!label || !panel) return;

    // For tab content, use the entire tab panel element
    rows.push([label, panel]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block element with the new block table
  tabsBlock.replaceWith(block);
}
