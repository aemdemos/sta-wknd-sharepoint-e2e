/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: header first
  const rows = [];
  const headerRow = ['Tabs (tabs18)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel) => {
    // Defensive: match tab label to panel by aria-controls
    const panelId = tabLabel.getAttribute('aria-controls');
    const panel = tabPanels.find(p => p.id === panelId);
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: use the entire panel content
    // Defensive: get the main contentfragment/article inside panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(block);
}
