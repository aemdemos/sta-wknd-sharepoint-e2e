/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first descendant tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));

  // Build header row with block name (must match 'Tabs (tabs37)' exactly)
  const cells = [
    ['Tabs (tabs37)']
  ];

  // For each tab, add a row [Tab Label, Tab Panel Content]
  tabLabels.forEach(tabLabel => {
    // Get tab label text
    const labelText = tabLabel.textContent.trim();
    // Find corresponding panel using aria-controls
    const panelId = tabLabel.getAttribute('aria-controls');
    let tabPanel = panelId ? tabs.querySelector(`#${panelId}`) : null;
    if (!tabPanel) {
      // fallback: get next .cmp-tabs__tabpanel
      tabPanel = tabs.querySelector('.cmp-tabs__tabpanel');
    }
    // Find meaningful content inside tab panel
    let tabContent = null;
    if (tabPanel) {
      // Prefer the main article/contentfragment inside the panel
      tabContent = tabPanel.querySelector('article') || tabPanel.querySelector('.contentfragment') || tabPanel;
    }
    cells.push([
      labelText,
      tabContent
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
