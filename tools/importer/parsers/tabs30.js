/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block by class
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.classList.contains('cmp-tabs') ? tabsBlock : tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: header first
  const rows = [['Tabs (tabs30)']];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Defensive: Find matching panel by aria-controls
    const panelId = tabLabel.getAttribute('aria-controls');
    const panel = cmpTabs.querySelector(`#${panelId}`);
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: use the entire panel content
    // Defensive: If panel has a single child (eg. .contentfragment), use that
    let tabContent;
    if (panel.children.length === 1) {
      tabContent = panel.firstElementChild;
    } else {
      // Otherwise, use the whole panel
      tabContent = panel;
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
