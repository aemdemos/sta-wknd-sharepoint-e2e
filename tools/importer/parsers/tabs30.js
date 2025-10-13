/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find cmp-tabs if tabsBlock is a wrapper
  const cmpTabs = tabsBlock.classList.contains('cmp-tabs') ? tabsBlock : tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim()) : [];

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // If mismatch or missing, do not proceed
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build table rows
  const rows = [];
  rows.push(['Tabs (tabs30)']); // Header row as required

  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // Find the main contentfragment inside the panel
    const cf = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (cf) {
      // Remove the redundant title if present
      const cfTitle = cf.querySelector('.cmp-contentfragment__title');
      if (cfTitle) cfTitle.remove();
      // Use the rest of the contentfragment as the tab content
      tabContent = cf;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
