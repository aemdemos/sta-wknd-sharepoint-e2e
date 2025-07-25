/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab block root
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Get all tab labels (in order)
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tab panel elements (in order)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabPanels.length !== tabLabels.length) return;

  // Compose cells: first row is single cell header, then each tab gets a row of [tab label, tab content]
  const cells = [['Tabs (tabs20)']];

  tabPanels.forEach((panel, idx) => {
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      const elements = article.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Exclude empty grid wrappers, but keep images, paragraphs, lists, etc.
        const children = Array.from(elements.childNodes).filter(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim().length > 0;
          }
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV') {
            if (node.querySelector('.cmp-image')) return true;
            if (node.children.length === 1 && node.firstElementChild.classList.contains('aem-Grid') && node.firstElementChild.textContent.trim().length === 0) {
              return false;
            }
            if (node.classList.contains('aem-Grid') && node.textContent.trim().length === 0) {
              return false;
            }
            if (node.textContent.trim().length === 0) return false;
          }
          return true;
        });
        if (children.length === 1) {
          tabContent = children[0];
        } else if (children.length > 1) {
          tabContent = children;
        } else {
          tabContent = document.createTextNode('');
        }
      } else {
        // fallback: all non-empty child nodes
        tabContent = Array.from(article.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim());
      }
    } else {
      // fallback: all non-empty child nodes of panel
      tabContent = Array.from(panel.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim());
    }
    cells.push([tabLabels[idx], tabContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsWrapper.replaceWith(table);
}
