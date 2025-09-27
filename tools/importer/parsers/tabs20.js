/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  tabList.querySelectorAll('.cmp-tabs__tab').forEach((tab) => {
    tabLabels.push(tab.textContent.trim());
  });

  // Get tab panels (content)
  const tabPanels = [];
  tabsContainer.querySelectorAll('[role="tabpanel"]').forEach((tabpanel) => {
    // Defensive: clone the content to avoid moving nodes from DOM
    const panelContent = document.createElement('div');
    // Only append children, not the tabpanel itself
    Array.from(tabpanel.childNodes).forEach((child) => {
      panelContent.appendChild(child.cloneNode(true));
    });
    tabPanels.push(panelContent);
  });

  // Build the table rows
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i += 1) {
    // Defensive: if a tab panel is missing, use an empty div
    const content = tabPanels[i] || document.createElement('div');
    rows.push([
      tabLabels[i],
      content
    ]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
