/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsRoot;
  if (tabsRoot && !tabsRoot.classList.contains('cmp-tabs')) {
    cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: If number of tabs and panels mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs14)']);

  // For each tab, build a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Extract the contentfragment/article inside the tabpanel
    const article = panel.querySelector('article');
    let tabContent = [];
    if (article) {
      // Exclude the .cmp-contentfragment__title (redundant)
      const cfTitle = article.querySelector('.cmp-contentfragment__title');
      Array.from(article.childNodes).forEach((node) => {
        if (cfTitle && node === cfTitle) return;
        if (node.nodeType === Node.ELEMENT_NODE) {
          tabContent.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          tabContent.push(span);
        }
      });
    } else {
      // Fallback: use all children of the panel
      Array.from(panel.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          tabContent.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          tabContent.push(span);
        }
      });
    }
    // Edge case: if tabContent is empty, insert an empty string
    if (tabContent.length === 0) tabContent = [''];
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
