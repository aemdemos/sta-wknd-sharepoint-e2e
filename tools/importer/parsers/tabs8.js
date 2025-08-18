/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (required for table headers)
  const tabList = tabsBlock.querySelector('[role="tablist"]');
  const tabItems = Array.from(tabList ? tabList.children : []);
  const tabLabels = tabItems.map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabpanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Table structure: First row is header (block name)
  // Each following row: [Tab Label, Tab Content]
  const cells = [];
  cells.push(['Tabs (tabs8)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabpanels[i];
    let tabContent = null;
    if (panel) {
      // Reference the contentfragment, or the whole panel if absent
      const cf = panel.querySelector('.cmp-contentfragment');
      tabContent = cf ? cf : panel;
    } else {
      tabContent = document.createTextNode('');
    }
    cells.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block ONLY (not the entire element)
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
