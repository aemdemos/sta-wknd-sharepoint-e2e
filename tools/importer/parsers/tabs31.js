/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all associated tabpanels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the header row as required by requirements
  const headerRow = ['Tabs (tabs31)'];

  // Build each row for each tab
  const rows = tabLabels.map((tab, idx) => {
    const label = tab.textContent.trim();
    // Robust matching of panel via aria-labelledby
    const tabId = tab.id;
    let panel = tabPanels.find(
      (tp) => tp.getAttribute('aria-labelledby') === tabId
    );
    if (!panel) {
      // fallback for possible missing attribute
      panel = tabPanels[idx];
    }
    // For the content: try to select the main content/article if exists, else use the panel itself
    let content = null;
    // Prefer .contentfragment > article, fallback to first child, fallback to panel
    const article = panel && panel.querySelector('article');
    if (article) {
      content = article;
    } else if (panel && panel.firstElementChild) {
      content = panel.firstElementChild;
    } else {
      content = panel;
    }
    return [label, content];
  });

  // Compose the table
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabs node with the table
  tabs.replaceWith(table);
}
