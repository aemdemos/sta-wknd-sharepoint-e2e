/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab label elements (li)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('ol.cmp-tabs__tablist > li'));
  if (tabLabels.length === 0) return;

  // Get tabpanel elements (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));
  if (tabPanels.length !== tabLabels.length) return;

  // First row: single cell with block name
  const cells = [ ['Tabs (tabs23)'] ];

  // Each tab: row with two columns: [Tab Label (bold), Tab Content]
  tabLabels.forEach((labelNode, i) => {
    const strong = document.createElement('strong');
    strong.textContent = labelNode.textContent.trim();
    const panel = tabPanels[i];
    // Try to find the main content (e.g. <article>) inside the panel
    let content = panel.querySelector('article');
    if (!content) {
      // fallback: use the first non-empty element child
      content = Array.from(panel.children).find(node => node.nodeType === 1) || panel;
    }
    cells.push([strong, content]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block in the DOM
  tabsBlock.replaceWith(table);
}
