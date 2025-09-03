/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header: must match block name exactly
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: get the main content inside the tab panel
    // Usually a .contentfragment or similar
    let tabContent = null;
    // Try to find a contentfragment/article inside
    tabContent = panel.querySelector('.contentfragment, article') || panel;

    // Use the actual DOM node for content, not a clone or string
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
