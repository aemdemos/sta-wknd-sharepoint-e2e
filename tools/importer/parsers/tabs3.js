/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from cmp-tabs__tablist
  const tabList = tabsContainer.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children).map(li => li.textContent.trim()) : [];

  // Get tab panels in order
  const tabPanels = tabLabels.map((_, i) => {
    // Use the tab's aria-controls to associate panel with label (more robust)
    const tab = tabList.children[i];
    if (!tab) return null;
    const tabPanelId = tab.getAttribute('aria-controls');
    if (!tabPanelId) return null;
    return tabsContainer.querySelector(`#${tabPanelId}`);
  });

  // Build table rows
  const rows = [['Tabs (tabs3)']];

  // Each tab: [label, content-element]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // For the tab content cell, reference the main article (contentfragment) within the tabpanel if present,
    // otherwise, use the tab panel's content directly
    let contentElement = null;
    const article = panel.querySelector('article');
    if (article) {
      contentElement = article;
    } else {
      // fallback: reference the tabpanel itself
      contentElement = panel;
    }
    rows.push([label, contentElement]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabsContainer with the new block
  tabsContainer.replaceWith(block);
}
