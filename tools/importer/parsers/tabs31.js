/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  );

  // Get tab panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the cells array correctly:
  // Header row should be a single cell, data rows should be two columns
  const cells = [];
  // Header: one cell only
  cells.push(['Tabs (tabs31)']);

  // Data rows: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let cellContent = [];
    if (panel) {
      const article = panel.querySelector('article');
      if (article) {
        const cfElements = article.querySelector('.cmp-contentfragment__elements');
        if (cfElements) {
          // Get all children of contentfragment__elements, filtering empty wrappers
          const children = Array.from(cfElements.childNodes).filter(n => {
            if (n.nodeType === 3 && !n.textContent.trim()) return false;
            if (n.nodeType === 1 && n.classList.contains('aem-Grid') && !n.textContent.trim() && !n.querySelector('img,ul,li,p,h1,h2,h3,h4,h5,h6')) return false;
            return true;
          });
          let flattened = [];
          children.forEach(child => {
            if (child.nodeType === 1 && child.tagName === 'DIV' && child.children.length === 1 && !child.querySelector('.aem-Grid')) {
              flattened.push(child.firstElementChild);
            } else {
              flattened.push(child);
            }
          });
          cellContent = flattened.filter(Boolean);
        } else {
          // fallback: all children of article except the .cmp-contentfragment__title
          cellContent = Array.from(article.childNodes).filter(n => {
            if (n.nodeType === 1 && n.classList.contains('cmp-contentfragment__title')) return false;
            if (n.nodeType === 3 && !n.textContent.trim()) return false;
            return true;
          });
        }
      } else {
        cellContent = Array.from(panel.childNodes).filter(n => (n.nodeType !== 3 || n.textContent.trim()));
      }
    }
    const cell = cellContent.length === 1 ? cellContent[0] : cellContent;
    cells.push([label, cell]);
  }
  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabsContainer with the block table
  tabsContainer.replaceWith(table);
}
