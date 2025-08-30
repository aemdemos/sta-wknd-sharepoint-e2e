/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs inside a .tabs container)
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Get all tabpanels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare rows for the block table
  const rows = [];
  // Table header row - block name
  rows.push(['Tabs (tabs13)']);

  // For each tab, fetch its label and content
  tabLabels.forEach((tabLabel) => {
    const label = tabLabel.textContent.trim();
    const controls = tabLabel.getAttribute('aria-controls');
    const tabPanel = tabPanels.find(p => p.id === controls);
    let contentElem = null;
    if (tabPanel) {
      // Find contentfragment article if present, else use the tabPanel's content
      const article = tabPanel.querySelector('article');
      if (article) {
        contentElem = article;
      } else {
        // If no article, reference the tabPanel itself
        contentElem = tabPanel;
      }
    } else {
      // If there is no tabPanel, create an empty cell
      contentElem = document.createElement('div');
    }
    rows.push([label, contentElem]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the block table
  tabsContainer.replaceWith(table);
}
