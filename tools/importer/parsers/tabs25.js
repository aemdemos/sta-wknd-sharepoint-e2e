/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  // Defensive: if not found, try to find cmp-tabs directly
  let cmpTabs = tabsBlock ? tabsBlock.querySelector('.cmp-tabs') : element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Build rows for each tab
  const rows = tabLabels.map((label, i) => {
    // Defensive: match tabPanels by order
    const panel = tabPanels[i];
    // Defensive: if not found, skip
    if (!panel) return null;
    // For content, use the main contentfragment/article inside the panel
    let content = panel.querySelector('article') || panel;
    return [label, content];
  }).filter(Boolean);

  // Table header
  const headerRow = ['Tabs (tabs25)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original tabs block with block table
  cmpTabs.parentNode.replaceChild(block, cmpTabs);
}
