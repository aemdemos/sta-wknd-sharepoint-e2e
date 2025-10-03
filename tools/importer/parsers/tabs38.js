/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab label and content from tabpanel
  function getTabRows(tabsRoot) {
    const tabRows = [];
    // Get tab labels from the tablist
    const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
    const tabLabels = Array.from(tabList ? tabList.children : []).map(li => li.textContent.trim());
    // Get tabpanel elements
    const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
    // Defensive: match tabPanels to tabLabels by order
    tabPanels.forEach((panel, i) => {
      const label = tabLabels[i] || `Tab ${i+1}`;
      // Tab content: use the entire tabpanel content (usually a contentfragment/article)
      // Find the main contentfragment/article inside the panel
      let content = null;
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Fallback: use the panel itself
        content = panel;
      }
      tabRows.push([label, content]);
    });
    return tabRows;
  }

  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer .cmp-tabs');
  if (!tabsBlock) return;

  // Build table rows
  const headerRow = ['Tabs (tabs38)'];
  const tabRows = getTabRows(tabsBlock);
  const tableRows = [headerRow, ...tabRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(block);
}
