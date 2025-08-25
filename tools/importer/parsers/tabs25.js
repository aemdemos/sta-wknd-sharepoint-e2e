/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Find all tab panels (in DOM order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Build the header row exactly as specified
  const cells = [['Tabs (tabs25)']];

  // Add one row per tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Prefer referencing the contentfragment article if present
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // Otherwise, gather all panel children as an array, as reference
        const panelChildren = Array.from(panel.children);
        if (panelChildren.length > 0) {
          contentCell = panelChildren;
        } else {
          contentCell = panel.innerHTML.trim();
        }
      }
    }
    cells.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
