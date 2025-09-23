/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tablist
  const tabLabels = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  tabList.querySelectorAll('li[role="tab"]').forEach(tabEl => {
    tabLabels.push(tabEl.textContent.trim());
  });

  // Get tab panels (content)
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');
  if (tabPanels.length !== tabLabels.length) return;

  // Build rows: each row is [label, content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: find the main content fragment inside each tab panel
    let contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the content fragment's elements as tab content (preserve structure)
      // Find the .cmp-contentfragment__elements container
      const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elementsContainer) {
        tabContent = elementsContainer.cloneNode(true);
      } else {
        tabContent = contentFragment.cloneNode(true);
      }
    } else {
      // Fallback: use the panel itself
      tabContent = panel.cloneNode(true);
    }
    rows.push([label, tabContent]);
  }

  // Table header
  const headerRow = ['Tabs (tabs24)'];
  const tableRows = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
