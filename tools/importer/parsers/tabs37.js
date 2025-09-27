/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure we have the same number of labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build the table rows
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // The content we want is the contentfragment/article inside the panel
    // We'll grab the article or fallback to the panel's children
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      // Remove the h3 title inside the article (redundant with tab label)
      const h3 = article.querySelector('h3.cmp-contentfragment__title');
      if (h3) h3.remove();
      tabContent = Array.from(article.childNodes).filter(
        n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
      );
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.childNodes).filter(
        n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
      );
    }

    // If only one element, use it directly, else use array
    let contentCell;
    if (tabContent.length === 1) {
      contentCell = tabContent[0];
    } else {
      contentCell = tabContent;
    }

    rows.push([label, contentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsContainer.replaceWith(table);
}
