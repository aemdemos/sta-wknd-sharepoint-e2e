/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as required
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // Get tab labels (li elements inside ol.cmp-tabs__tablist)
  const tabList = element.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(element.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Map tab labels to their corresponding content panels
  tabLabels.forEach((tabLabel) => {
    // Find the panel by aria-controls
    const panelId = tabLabel.getAttribute('aria-controls');
    const tabPanel = tabPanels.find((panel) => panel.id === panelId);
    let tabContent = '';
    if (tabPanel) {
      // Use the entire article.cmp-contentfragment inside the tabpanel as the content cell
      const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        // Clone to avoid moving the original node
        tabContent = contentFragment.cloneNode(true);
      } else {
        // fallback: use all children of tabPanel
        tabContent = document.createElement('div');
        Array.from(tabPanel.childNodes).forEach(node => {
          tabContent.appendChild(node.cloneNode(true));
        });
      }
    }
    rows.push([tabLabel.textContent.trim(), tabContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
