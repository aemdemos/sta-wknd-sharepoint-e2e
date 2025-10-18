/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsContainer = tabsBlock;
  if (!tabsContainer) {
    // fallback: look for cmp-tabs inside .tabs
    tabsContainer = element.querySelector('.cmp-tabs');
  }
  if (!tabsContainer) return;

  // Get tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];

  // Get tab panels
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: if no labels or panels, abort
  if (!tabLabels.length || !tabPanels.length) return;

  // Compose table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs33)']);

  // Each tab: label, content
  tabLabels.forEach((tab, i) => {
    // Tab label text
    const label = tab.textContent.trim();
    // Find corresponding panel
    // Panels may not be in same order as labels, so use aria-controls
    let panel = tabPanels.find(p => p.id === tab.getAttribute('aria-controls'));
    if (!panel) {
      // fallback: use index
      panel = tabPanels[i];
    }
    // Defensive: skip if no panel
    if (!panel) return;

    // For content, use the entire panel content
    // Defensive: if panel contains only a single wrapper, unwrap it
    let content = panel;
    // If the panel contains only one child (e.g. a contentfragment), use that child
    const children = Array.from(panel.children).filter(c => c.nodeType === 1);
    if (children.length === 1) {
      content = children[0];
    }
    // Place label and content in row
    rows.push([label, content]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace tabs block with block table
  tabsBlock.replaceWith(block);
}
