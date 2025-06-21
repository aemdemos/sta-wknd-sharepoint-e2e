/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (container of the tabs component)
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element inside the tabs container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels in order
  const tabLabelNodes = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  const tabLabels = tabLabelNodes.map(tab => tab.textContent.trim());

  // Get all the tab panels in order
  const tabPanelNodes = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows
  const rows = [];
  // The header row must match exactly (single header cell)
  rows.push(['Tabs (tabs28)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanelNodes[i];
    if (!panel) continue; // skip if missing

    // For the content cell, use the main content inside the tab panel
    // Usually, the content is the first (and usually only) child .contentfragment > article
    let content = null;
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // fallback: use all direct children (excluding script/style)
      const children = Array.from(panel.children).filter(child => child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE');
      if (children.length === 1) content = children[0];
      else if (children.length > 1) content = children;
      else content = panel;
    }
    // Each tab row must be an array of exactly [label, content] (2 columns)
    rows.push([label, content]);
  }

  // Create the block table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabsContainer with the table
  tabsContainer.replaceWith(table);
}
