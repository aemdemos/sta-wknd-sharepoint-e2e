/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (by class or role)
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs container (tab navigation and panels)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Find tab labels (li elements inside tablist)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row (must be single column per spec)
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i] || null;
    const tabLabelCell = label.textContent.trim();
    let tabContentCell = null;
    if (panel) {
      // Use the contentfragment if present, else the panel
      const cf = panel.querySelector('.cmp-contentfragment');
      tabContentCell = cf ? cf : panel;
    } else {
      tabContentCell = '';
    }
    rows.push([tabLabelCell, tabContentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
