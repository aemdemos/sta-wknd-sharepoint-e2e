/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Get the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
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

  // Defensive: ensure labels and panels match
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // For tab content, use the entire tabpanel content
    // Defensive: If the tabpanel contains a single child contentfragment, use that
    let tabContent;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    tabRows.push([label, tabContent]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs28)'];

  // Table cells
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
