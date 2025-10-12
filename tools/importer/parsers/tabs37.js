/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;

  // Get tab headers (tab titles)
  const tabHeaderEls = cmpTabs.querySelectorAll('.cmp-tabs__tablist > li');
  // Get tab panels (tab content)
  const tabPanelEls = cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Defensive: ensure equal number of headers and panels
  if (tabHeaderEls.length !== tabPanelEls.length || tabHeaderEls.length === 0) return;

  // Build header row
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabHeaderEls.forEach((tabHeader, idx) => {
    const label = tabHeader.textContent.trim();
    const tabPanel = tabPanelEls[idx];

    // Defensive: skip if panel is missing
    if (!tabPanel) return;

    // For content: grab all children of the tab panel
    // We'll collect all direct children (to preserve structure)
    const contentNodes = Array.from(tabPanel.childNodes).filter(
      node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
    );
    // If only one child, use it directly; else, use array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    } else {
      // fallback: empty div
      contentCell = document.createElement('div');
    }
    rows.push([label, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsContainer.replaceWith(table);
}
