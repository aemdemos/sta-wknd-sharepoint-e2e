/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsRoot = element.querySelector('.tabs');
  if (!tabsRoot) return;

  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Extract tab panels by role=tabpanel (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Build rows: [Tab Label, Tab Content Element]
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const labelText = labelEl.textContent.trim();
    const controlsId = labelEl.getAttribute('aria-controls');
    const panelEl = tabPanels.find(panel => panel.id === controlsId);
    if (!panelEl) continue;

    // Find the main content for the tab
    // Prefer the .contentfragment > article if present
    const article = panelEl.querySelector('.contentfragment > article');
    let tabContentEl;
    if (article) {
      tabContentEl = article;
    } else {
      // Fallback to all children of panelEl except empty placeholder grids
      // Filter out empty .aem-Grid containers with no real content
      tabContentEl = document.createElement('div');
      Array.from(panelEl.children).forEach(child => {
        if (
          child.classList && child.classList.contains('aem-Grid') &&
          child.textContent.trim() === ''
        ) {
          // skip empty grid
        } else {
          tabContentEl.appendChild(child);
        }
      });
      // If nothing appended, fallback to panelEl itself
      if (!tabContentEl.hasChildNodes()) {
        tabContentEl = panelEl;
      }
    }
    tabRows.push([labelText, tabContentEl]);
  }

  // Table structure: first row is header, next rows are [label, content]
  const cells = [
    ['Tabs (tabs34)'], // Block header row (matches provided block name)
    ...tabRows,
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(block);
}
