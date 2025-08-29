/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsWrapper = element.querySelector('.cmp-tabs');
  if (!tabsWrapper) return;

  // Find all tab labels (li inside tablist)
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  // Find associated tabpanels (divs with .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, extract its label and content
  tabItems.forEach((tabItem, idx) => {
    const tabLabel = tabItem.textContent.trim();
    // Match tabpanel: by aria-controls if available, else index
    let tabPanel;
    const ariaControls = tabItem.getAttribute('aria-controls');
    if (ariaControls) {
      tabPanel = tabsWrapper.querySelector(`#${ariaControls}`);
    } else {
      tabPanel = tabPanels[idx];
    }
    if (!tabPanel) return;
    // The tab panel may have a <article> child or just content directly
    let tabContent;
    const article = tabPanel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // Use all non-empty child nodes
      const nodes = Array.from(tabPanel.childNodes)
        .filter(node => (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())));
      if (nodes.length === 1) {
        tabContent = nodes[0];
      } else if (nodes.length > 1) {
        tabContent = nodes;
      } else {
        tabContent = '';
      }
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}
