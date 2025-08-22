/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : [])
    .map(li => li.textContent.trim());

  // Get tab panel contents (each .cmp-tabs__tabpanel)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');
  const tabContents = Array.from(tabPanels).map(panel => {
    // Prefer the main <article> if present, else the panel itself
    const mainArticle = panel.querySelector('article.cmp-contentfragment');
    if (mainArticle) {
      return mainArticle;
    } else {
      // Fallback: reference panel itself
      return panel;
    }
  });

  // Header row: block name and variant
  const headerRow = ['Tabs (tabs34)'];
  // Each subsequent row: [tab label, tab content]
  const cells = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // If tab label or content is missing, skip this tab
    if (!tabLabels[i] || !tabContents[i]) continue;
    cells.push([tabLabels[i], tabContents[i]]);
  }

  // Create the block table and replace tabs in the DOM
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.parentNode.replaceChild(block, tabs);
}
