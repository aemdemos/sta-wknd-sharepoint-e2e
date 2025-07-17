/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (the div with class 'tabs' that contains a 'cmp-tabs')
  let tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) {
    if (element.classList.contains('tabs')) tabsWrapper = element;
    else tabsWrapper = element.querySelector('.cmp-tabs')?.parentElement;
  }
  if (!tabsWrapper) return;

  let cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) {
    if (tabsWrapper.classList.contains('cmp-tabs')) cmpTabs = tabsWrapper;
    else return;
  }

  // Extract tab labels and corresponding tabpanel ids
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  const tabIds = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
      tabIds.push(li.getAttribute('aria-controls'));
    });
  }
  if (tabLabels.length === 0) return;
  const tabCount = tabLabels.length;

  // Get tab content for each tab, extracting only the relevant content (not the heading)
  const tabContents = tabIds.map(panelId => {
    const panel = cmpTabs.querySelector(`#${panelId}`);
    if (!panel) return '';
    let mainContent = panel.querySelector('article, .contentfragment');
    if (mainContent) {
      // Exclude h3 titles, return all other children as array or single element
      const children = Array.from(mainContent.children).filter(child => child.tagName !== 'H3');
      if (children.length === 1) return children[0];
      if (children.length > 1) return children;
      // fallback: if no children, include all child nodes
      const nodes = Array.from(mainContent.childNodes).filter(node => node.nodeType !== 3 || node.textContent.trim() !== '');
      if (nodes.length === 1) return nodes[0];
      if (nodes.length > 1) return nodes;
      return mainContent;
    } else {
      // fallback: all children of panel
      const nodes = Array.from(panel.childNodes).filter(node => node.nodeType !== 3 || node.textContent.trim() !== '');
      if (nodes.length === 1) return nodes[0];
      if (nodes.length > 1) return nodes;
      return '';
    }
  });

  // Build table rows per spec: header, tab labels row, then one row per tab with content in the correct column
  const cells = [];
  // Header row: single column, block name
  cells.push(['Tabs (tabs12)']);
  // Tab labels row: one cell per tab
  cells.push(tabLabels);
  // Content rows: each row has the same number of columns as tabLabels. Only the cell matching the tab gets the content, others are blank
  for (let i = 0; i < tabCount; i++) {
    const row = Array(tabCount).fill('');
    row[i] = tabContents[i];
    cells.push(row);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsWrapper.replaceWith(table);
}
