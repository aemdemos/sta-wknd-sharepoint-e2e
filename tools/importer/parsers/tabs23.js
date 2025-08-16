/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels and corresponding tab panels in order
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header (single cell, matching the example)
  const cells = [["Tabs (tabs23)"]];

  // Each following row: [tab label (bold), tab content]
  tabLabels.forEach((tab, idx) => {
    // Tab label in <strong>
    const label = document.createElement('strong');
    label.textContent = tab.textContent.trim();
    // Tab content: entire article/contentfragment block or all content
    const panel = tabPanels[idx];
    let tabContent;
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      tabContent = Array.from(panel.childNodes).filter(
        node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
      );
    }
    cells.push([label, tabContent]);
  });
  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(block);
}
