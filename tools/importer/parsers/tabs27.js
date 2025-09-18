/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build rows: first row is always the block name
  const cells = [ ['Tabs (tabs27)'] ];

  // For each tab, pair label and content
  tabLabels.forEach((labelEl) => {
    // Find corresponding panel by aria-controls
    const panelId = labelEl.getAttribute('aria-controls');
    const panelEl = tabPanels.find(p => p.id === panelId);
    if (!panelEl) return;

    // Tab label: use textContent
    const tabLabel = labelEl.textContent.trim();

    // Tab content: find the main contentfragment/article inside panel
    let tabContent;
    const contentFragment = panelEl.querySelector('article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panelEl itself
      tabContent = panelEl;
    }

    cells.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
