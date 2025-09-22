/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels and tab panels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row as required
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;
    // Collect all child nodes of the panel (preserving structure and references)
    const contentNodes = Array.from(panel.childNodes);
    // Defensive: if panel is empty, use empty string
    rows.push([label, contentNodes.length ? contentNodes : '']);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
