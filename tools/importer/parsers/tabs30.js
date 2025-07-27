/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the given block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels (li elements in order)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Extract tab content panels (in order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Ensure the label and panel array lengths match
  if (tabLabels.length !== tabPanels.length) {
    // If not, try to continue but only up to the shortest length
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Prepare the header row as per block name
  const headerRow = ['Tabs (tabs30)'];
  const rows = [];

  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label: use the text content
    const label = tabLabels[i] && tabLabels[i].textContent.trim();

    // Tab panel: find the main content within each panel
    const tabPanel = tabPanels[i];
    let tabContent = null;
    // The actual content is usually inside a <article> within the tab panel
    const article = tabPanel && tabPanel.querySelector('article');
    if (article) {
      tabContent = article;
    } else if (tabPanel) {
      // Fallback: use the tabPanel itself if no article
      tabContent = tabPanel;
    } else {
      tabContent = document.createElement('div');
    }
    rows.push([label, tabContent]);
  }

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabs.replaceWith(table);
}