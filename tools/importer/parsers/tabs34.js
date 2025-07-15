/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .cmp-tabs element inside element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    const tabLabelElements = tabList.querySelectorAll('[role="tab"]');
    tabLabels = Array.from(tabLabelElements).map(tab => tab.textContent.trim());
  }

  // Extract tab content panels in order
  // The panels have [role="tabpanel"] and data-cmp-hook-tabs="tabpanel"
  let tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));
  // Defensive: Ensure number of panels matches labels
  if (tabPanels.length > tabLabels.length) {
    tabPanels = tabPanels.slice(0, tabLabels.length);
  }
  // Defensive: If panels < labels, fill with empty divs
  if (tabPanels.length < tabLabels.length) {
    for (let i = tabPanels.length; i < tabLabels.length; i++) {
      tabPanels.push(document.createElement('div'));
    }
  }

  // Use the main article inside each tab panel if available, for most resilient referencing
  const contentsRow = tabPanels.map(tabPanel => {
    // Use first <article> if present, else everything inside panel
    const article = tabPanel.querySelector('article');
    if (article) {
      return article;
    }
    // fallback: use tabPanel
    return tabPanel;
  });

  // Compose table rows: header, tab labels, tab contents
  const headerRow = ['Tabs (tabs34)'];
  const labelsRow = tabLabels;
  const tableRows = [headerRow, labelsRow, contentsRow];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
