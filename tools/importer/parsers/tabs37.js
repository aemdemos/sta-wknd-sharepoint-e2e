/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (order matters!)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    const tabItems = tabList.querySelectorAll('.cmp-tabs__tab');
    tabItems.forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels and their content
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Prepare table header (must match example exactly)
  const headerRow = ['Tabs (tabs37)'];

  // Prepare tab rows: [Tab Label, Tab Content]
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // The content for the cell should be the main contentfragment/article within the tabpanel
    let contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (!contentFragment) {
      // fallback: use all children of the panel (as an array), or the panel itself if empty
      const meaningfulChildren = Array.from(panel.children).filter(child => child.nodeType === 1 && child.innerHTML.trim() !== '');
      if (meaningfulChildren.length) {
        contentFragment = meaningfulChildren.length === 1 ? meaningfulChildren[0] : meaningfulChildren;
      } else {
        contentFragment = panel;
      }
    }
    tabRows.push([label, contentFragment]);
  }

  // The final table: header row, then one row per tab
  const tableRows = [headerRow, ...tabRows];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the tabs element with the block
  tabs.replaceWith(block);
}
