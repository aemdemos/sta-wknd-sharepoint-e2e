/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab navigation (tab labels)
  const tabNav = tabsBlock.querySelector('.cmp-tabs__tablist, [role="tablist"]');
  if (!tabNav) return;
  const tabLabels = Array.from(tabNav.querySelectorAll('[role="tab"], .cmp-tabs__tab'));

  // Find tab panels (tab contents)
  // Each tab panel should correspond to a tab label in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel'));

  // Defensive: If tab count doesn't match panel count, bail
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header
  const headerRow = ['Tabs (tabs9)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];

    // Defensive: If panel is missing, skip
    if (!panel) return;

    // Extract the main content from the panel
    // Usually a contentfragment/article or direct children
    let tabContent = null;
    // Prefer the contentfragment/article if present
    const cf = panel.querySelector('article.cmp-contentfragment, .contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // Otherwise, use all children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }

    // Add row: [Tab Label, Tab Content]
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
