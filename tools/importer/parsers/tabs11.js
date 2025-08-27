/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);
  
  // Get all tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the header row
  const cells = [
    ['Tabs (tabs11)']
  ];

  // For each tab, create a row with label and corresponding content panel
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    // The corresponding panel
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Collect all childNodes except empty grid containers and the tab title
      const contents = [];
      Array.from(panel.childNodes).forEach(node => {
        // Exclude empty .aem-Grid, and .cmp-contentfragment__title (usually duplicate heading)
        if (node.nodeType === 1) {
          if (
            !node.classList.contains('aem-Grid') &&
            !node.classList.contains('cmp-contentfragment__title') &&
            !(node.tagName === 'DIV' && node.childNodes.length === 0)
          ) {
            contents.push(node);
          }
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // non-empty text
          contents.push(node);
        }
      });
      // Use all collected nodes if any, otherwise fallback
      if (contents.length > 0) {
        content = contents;
      } else {
        content = panel;
      }
    } else {
      content = '';
    }
    cells.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsRoot with our table
  tabsRoot.replaceWith(table);
}
