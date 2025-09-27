/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab label and content from tabs block
  function getTabsData(tabsBlock) {
    const tabsData = [];
    // Find tab labels
    const tabLabels = Array.from(
      tabsBlock.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
    );
    // Find tab panels
    const tabPanels = Array.from(
      tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
    );
    // Defensive: Only pair as many panels as there are labels
    for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
      const label = tabLabels[i].textContent.trim();
      // Tab content: find the main contentfragment/article inside the panel
      let content = tabPanels[i].querySelector('article');
      // If not found, fallback to panel itself
      if (!content) content = tabPanels[i];
      tabsData.push([label, content]);
    }
    return tabsData;
  }

  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  // Defensive: If not found, try to find by id pattern
  let cmpTabs = tabsBlock;
  if (!cmpTabs) {
    cmpTabs = element.querySelector('[class*="cmp-tabs"]');
  }
  if (!cmpTabs) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];
  const tabsData = getTabsData(cmpTabs);
  tabsData.forEach(([label, content]) => {
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  cmpTabs.parentNode.replaceChild(block, cmpTabs);
}
