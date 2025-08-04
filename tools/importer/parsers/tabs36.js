/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tab list
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelElements = tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : [];

  // Get tab panels (content)
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Build the rows. First row: single header cell. Subsequent rows: two cells (label, content)
  const cells = [];
  cells.push(['Tabs (tabs36)']); // single cell header row

  tabLabelElements.forEach((tabLabelEl, i) => {
    // Tab name
    const tabLabel = tabLabelEl.textContent.trim();
    // Tab content
    const tabPanel = tabPanels[i];
    let tabContent;
    if (tabPanel) {
      // The main content is within <article> or its children
      const article = tabPanel.querySelector('article');
      if (article) {
        // Find the .cmp-contentfragment__elements within the article
        const elementsContainer = article.querySelector('.cmp-contentfragment__elements');
        if (elementsContainer) {
          // We'll collect all direct children of elementsContainer that hold the real content
          const tabContentNodes = [];
          Array.from(elementsContainer.children).forEach(child => {
            // Ignore empty grid wrappers
            if ((child.classList && child.classList.contains('aem-Grid')) && child.textContent.trim() === '' && child.querySelectorAll('img, p, ul, ol, li').length === 0) {
              return;
            }
            if (child.querySelector('img, p, ul, ol, li, div:not([class*="aem-Grid"])') ||
                child.tagName === 'P' || child.tagName === 'UL' || child.tagName === 'OL' || child.tagName === 'IMG') {
              // If this child has further structure, extract its children
              if (child.childNodes.length > 0) {
                Array.from(child.childNodes).forEach(node => {
                  // Also ignore empty grid wrappers
                  if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid') && node.textContent.trim() === '') return;
                  tabContentNodes.push(node);
                });
              } else {
                tabContentNodes.push(child);
              }
            }
          });
          // If we have real nodes, use them as tab content
          tabContent = tabContentNodes.length ? tabContentNodes : '';
        } else {
          // Fallback: get everything after h3 in the article
          tabContent = [];
          let afterH3 = false;
          Array.from(article.childNodes).forEach(node => {
            if (afterH3) {
              if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
                tabContent.push(node);
              }
            }
            if (node.nodeType === 1 && node.tagName.toLowerCase() === 'h3') {
              afterH3 = true;
            }
          });
          if (!tabContent.length) tabContent = '';
        }
      } else {
        // fallback: use all children except script/style
        const tabNodes = [];
        Array.from(tabPanel.childNodes).forEach((node) => {
          if (node.nodeType === 1) {
            if (['SCRIPT', 'STYLE'].includes(node.tagName)) return;
            tabNodes.push(node);
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            tabNodes.push(node);
          }
        });
        tabContent = tabNodes.length ? tabNodes : '';
      }
    } else {
      tabContent = '';
    }
    cells.push([tabLabel, tabContent]); // two-cell row
  });

  // Build the table (header row is 1 cell, content rows are 2 cells)
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix the header row to span two columns so that visually it matches the block header example
  // (since createTable doesn't add colspan, we add it here after creation)
  const headerTr = table.querySelector('tr');
  if (headerTr && headerTr.children.length === 1 && cells.length > 1 && cells[1].length === 2) {
    headerTr.children[0].setAttribute('colspan', '2');
  }

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
