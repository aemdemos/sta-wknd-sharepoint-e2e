/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (class contains 'tabs' and 'panelcontainer')
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Get the .cmp-tabs block inside
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the ordered list (tablist)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());

  // Get the tabpanels in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // For each tab panel, extract the main tab content as a reference to the existing element
  const tabContents = tabPanels.map(panel => {
    // Usually a contentfragment/article is present
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      // Inside article > .cmp-contentfragment__elements > last div contains the real content
      const elementsContainer = article.querySelector('.cmp-contentfragment__elements');
      if (elementsContainer) {
        // The real content is usually in the last <div> with children
        let mainDiv = null;
        const divs = Array.from(elementsContainer.children).filter((el) => el.tagName === 'DIV');
        // Often the first <div> is a grid (empty), the second is the real content
        // But sometimes only one <div> present
        if (divs.length > 1) {
          mainDiv = divs[divs.length - 1];
        } else if (divs.length === 1) {
          mainDiv = divs[0];
        }
        // If mainDiv contains meaningful content, use that
        if (mainDiv && mainDiv.childElementCount > 0) {
          return mainDiv;
        } else {
          // Fallback: use all childNodes of elementsContainer (except the grid div)
          // Find the first div that looks empty and skip it
          const frg = document.createElement('div');
          Array.from(elementsContainer.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.childElementCount === 0) {
              // skip empty grid div
              return;
            }
            frg.appendChild(node);
          });
          return frg;
        }
      }
      // Fallback: use the entire article
      return article;
    }
    // Fallback: use the panel itself
    return panel;
  });

  // Create the header
  const headerRow = ['Tabs (tabs7)'];
  // Second row: tab labels (one per column)
  const labelsRow = tabLabels;
  // Third row: tab contents (one per column)
  const contentRow = tabContents;

  // Compose the cells array
  const cells = [
    headerRow,
    labelsRow,
    contentRow
  ];

  // Generate the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs container with the table
  tabsContainer.replaceWith(table);
}
