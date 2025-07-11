/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cmp-tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and their corresponding panel IDs
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  // Map: panelId -> label text
  const tabIdToLabel = {};
  tabLabels.forEach(label => {
    const controls = label.getAttribute('aria-controls');
    if (controls) {
      tabIdToLabel[controls] = label.textContent.trim();
    }
  });

  // Get all tabpanels (content)
  const panels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  // Compose rows for the block table
  const rows = panels.map(panel => {
    const label = tabIdToLabel[panel.id] || '';
    // Reference the article if present, else the first child, else the panel
    let contentEl = null;
    const article = panel.querySelector('article');
    if (article) {
      contentEl = article;
    } else if (panel.firstElementChild) {
      contentEl = panel.firstElementChild;
    } else {
      contentEl = panel;
    }
    return [label, contentEl];
  });
  // Compose the full table block with the correct header
  const cells = [
    ['Tabs (tabs12)'],
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
