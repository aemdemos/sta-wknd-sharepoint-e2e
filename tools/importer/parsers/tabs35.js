/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab labels and content
  function getTabsData(tabsContainer) {
    // Get tab labels
    const tabLabels = Array.from(
      tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
    ).map(tab => tab.textContent.trim());

    // Get tab panels (content)
    const tabPanels = Array.from(
      tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
    );

    // Defensive: ensure labels and panels match
    const tabs = [];
    for (let i = 0; i < tabLabels.length; i++) {
      const label = tabLabels[i];
      const panel = tabPanels[i];
      if (!panel) continue;
      // For tab content, grab the main contentfragment/article inside panel
      let tabContent = null;
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        // Use the entire contentfragment/article as the tab content
        tabContent = cf;
      } else {
        // Fallback: use panel itself
        tabContent = panel;
      }
      tabs.push([label, tabContent]);
    }
    return tabs;
  }

  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Build header row
  const headerRow = ['Tabs (tabs35)'];

  // Build tab rows: each row [label, content]
  const tabRows = getTabsData(tabsBlock);

  // Compose table cells
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
