/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element (.cmp-tabs)
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(tab => tab.textContent.trim());

  // Get all tabpanels in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose header row as per requirement
  const headerRow = ['Tabs (tabs10)'];

  // Compose rows for each tab: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent = '';
    if (panel) {
      // Try to find the main content fragment/article inside tab panel
      // Use the actual contentfragment/article inside as the reference for the cell
      const contentFragment = panel.querySelector('.cmp-contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // Else, reference all child elements of the panel
        // (filter only element nodes)
        const children = Array.from(panel.childNodes).filter(n => n.nodeType === 1);
        tabContent = children.length > 1 ? children : (children[0] || '');
      }
    }
    rows.push([label, tabContent]);
  }

  // Build the cells for the block table
  const cells = [headerRow, ...rows];
  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the cmp-tabs element with the new block table
  cmpTabs.replaceWith(blockTable);
}
