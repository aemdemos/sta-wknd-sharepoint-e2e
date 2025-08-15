/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab content panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row (block name)
  const headerRow = ['Tabs (tabs34)'];

  // Prepare each tab row: [Tab Label, Tab Content]
  const rows = tabLabels.map((tab, i) => {
    // Tab label text
    const tabLabel = tab.textContent.trim();
    // Tab content element (reference existing element)
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Use all child nodes except script/style, reference from DOM
      // Find first 'article' child if present
      const article = panel.querySelector('article');
      if (article) {
        tabContent = article;
      } else {
        // If there's no article, use div.contentfragment or fallback to all content
        const contentFragment = panel.querySelector('div.contentfragment');
        if (contentFragment) {
          tabContent = contentFragment;
        } else {
          // Use panel itself
          tabContent = panel;
        }
      }
    } else {
      tabContent = '';
    }
    return [tabLabel, tabContent];
  });

  // Build final table data
  const tableData = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  // Replace the tabs block itself (not the parent) with the blockTable
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
