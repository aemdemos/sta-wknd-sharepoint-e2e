/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (by class name as in provided HTML)
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab label elements
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabelElements = tabList ? Array.from(tabList.children) : [];
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Get all tabpanel elements (order is the same as tabs)
  // Only consider direct children with role="tabpanel"
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Compose the table rows, each as [Tab Label, Content Block]
  const rows = [];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Try to find the main article or contentfragment inside the panel
      // But always reference the actual DOM node inside the original document
      let mainContent = panel.querySelector('article, .cmp-contentfragment, .cmp-contentfragment__elements');
      if (!mainContent || mainContent === panel) {
        // fallback: use panel itself
        content = panel;
      } else {
        content = mainContent;
      }
    } else {
      // Fallback to empty div if no panel found
      content = document.createElement('div');
    }
    rows.push([label, content]);
  }

  // Header row, as per spec
  const cells = [
    ['Tabs (tabs20)'],
    ...rows
  ];

  // Create the table and replace the original tabs block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsWrapper.replaceWith(block);
}
