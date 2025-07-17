/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Collect tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);

  // Collect tab panel contents in order
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Table: header row is a single cell, then each row is [label, content]
  const cells = [ ['Tabs (tabs8)'] ];

  tabLabels.forEach((tab, idx) => {
    const label = tab.textContent.trim();
    let contentElement = null;
    if (tab.hasAttribute('aria-controls')) {
      const panelId = tab.getAttribute('aria-controls');
      contentElement = tabs.querySelector(`#${panelId}`);
    } else if (tabPanels[idx]) {
      contentElement = tabPanels[idx];
    }
    let content = '';
    if (contentElement) {
      // Try to extract the main contentfragment article or direct content
      const article = contentElement.querySelector('article.cmp-contentfragment');
      if (article) {
        const cfElements = article.querySelector('.cmp-contentfragment__elements');
        if (cfElements) {
          // Remove any .aem-Grid divs and whitespace text nodes
          const meaningful = Array.from(cfElements.childNodes).filter(node => {
            if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid')) return false;
            if (node.nodeType === 3 && !node.textContent.trim()) return false;
            return true;
          });
          // If only one child and it's a div, drill in
          if (meaningful.length === 1 && meaningful[0].tagName === 'DIV') {
            const innerDiv = meaningful[0];
            const innerChildren = Array.from(innerDiv.childNodes).filter(node => {
              if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid')) return false;
              if (node.nodeType === 3 && !node.textContent.trim()) return false;
              return true;
            });
            content = innerChildren.length === 1 ? innerChildren[0] : innerChildren;
          } else {
            content = meaningful.length === 1 ? meaningful[0] : meaningful;
          }
        } else {
          // fallback: article itself
          content = article;
        }
      } else {
        // fallback: direct children (not .aem-Grid)
        const meaningful = Array.from(contentElement.childNodes).filter(node => {
          if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid')) return false;
          if (node.nodeType === 3 && !node.textContent.trim()) return false;
          return true;
        });
        content = meaningful.length === 1 ? meaningful[0] : meaningful;
      }
    }
    cells.push([label, content]); // <-- CRITICAL: two columns per row!
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
