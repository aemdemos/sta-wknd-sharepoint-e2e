/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs component root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Gather ALL tab labels (in order)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = tabList.querySelectorAll('li[role="tab"]');
  
  // Gather ALL tab panels (in order)
  const tabPanelEls = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  // Prepare the block table rows: header, then one for each tab
  const rows = [];
  rows.push(['Tabs (tabs34)']); // Table header matches required format

  tabLabelEls.forEach((tabLabelEl, i) => {
    const tabLabel = tabLabelEl.textContent.trim();
    const tabPanel = tabPanelEls[i];
    let tabContent;
    if (tabPanel) {
      // Try to find the main article/contentfragment inside the tabpanel
      // This is usually the detailed structured content: article or direct children
      const article = tabPanel.querySelector('article');
      if (article) {
        tabContent = article; // reference the article element directly
      } else {
        // If no article, try to gather all significant children
        // Filter out purely empty text nodes
        const children = Array.from(tabPanel.childNodes).filter(n => (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim() !== ''));
        if (children.length === 1) {
          tabContent = children[0];
        } else {
          tabContent = children;
        }
      }
    } else {
      tabContent = '';
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
