/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs container within the element
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;
  // Get all tab labels from the tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  // Get all tabpanels
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Compose the table header
  const headerRow = ['Tabs (tabs20)'];
  // Each row: [label, panel content]
  const rows = tabLabels.map(tab => {
    // Extract label
    const tabLabel = tab.textContent.trim();
    // Get panel by aria-controls/id
    const panelId = tab.getAttribute('aria-controls');
    let panel = panelId && tabsContainer.querySelector(`#${panelId}`);
    // Defensive: if not found, use empty div
    if (!panel) {
      panel = document.createElement('div');
    }
    // Use the contentfragment's article if present, otherwise the panel
    const article = panel.querySelector('article');
    const tabContent = article || panel;
    return [tabLabel, tabContent];
  });
  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the cmp-tabs (only the tab system, not the full element)
  tabsContainer.parentNode.replaceChild(block, tabsContainer);
}
