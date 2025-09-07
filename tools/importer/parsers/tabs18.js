/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block in the given element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tabs container (should be .cmp-tabs)
  const cmpTabs = tabsBlock.classList.contains('cmp-tabs') ? tabsBlock : tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (content)
  const tabPanels = cmpTabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build rows: each row is [label, content]
  const rows = [];
  tabPanels.forEach((panel, idx) => {
    // Defensive: get label for this panel
    const label = tabLabels[idx] || `Tab ${idx+1}`;
    // Defensive: get the content fragment inside the panel
    let content = null;
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      // Use the entire content fragment as the cell content
      content = contentFragment;
    } else {
      // Fallback: use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  });

  // Table header row
  const headerRow = ['Tabs (tabs18)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
