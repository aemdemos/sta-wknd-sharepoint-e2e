/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels and their corresponding tab panels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table header
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel) => {
    // Find corresponding tab panel
    const panelId = tabLabel.getAttribute('aria-controls');
    const tabPanel = tabsBlock.querySelector(`#${panelId}`);
    if (!tabPanel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: extract the main contentfragment/article inside the tab panel
    let tabContent = null;
    // Prefer the article, but fallback to all direct children
    const article = tabPanel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // Fallback: wrap all children in a div
      tabContent = document.createElement('div');
      Array.from(tabPanel.childNodes).forEach(child => {
        tabContent.appendChild(child.cloneNode(true));
      });
    }

    // Add row: [Tab Label, Tab Content]
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block element with the new table
  tabsBlock.replaceWith(table);
}
