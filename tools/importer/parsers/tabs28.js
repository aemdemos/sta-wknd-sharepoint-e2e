/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels from the tablist (order matters)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Extract tabpanel elements in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build rows: [Tab Label, Tab Content]
  const rows = tabPanels.map((panel, i) => {
    // Defensive: get the tab label
    const label = tabLabels[i] || `Tab ${i+1}`;
    // Find the main contentfragment inside this tabpanel
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the entire contentfragment as the tab content (reference, not clone)
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    return [label, tabContent];
  });

  // Table header row: must match block name exactly
  const headerRow = ['Tabs (tabs28)'];

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
