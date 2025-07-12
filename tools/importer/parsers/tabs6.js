/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Gather tab labels and tab ids in order
  const tabList = tabsBlock.querySelector('ol[role="tablist"], ul[role="tablist"]');
  const tabLabels = [];
  const tabPanelIds = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
      // tab panel id is in 'aria-controls' attribute
      const controls = tab.getAttribute('aria-controls');
      if (controls) tabPanelIds.push(controls);
    });
  }

  // Gather tab panels, matching in order of tabLabels/tabPanelIds
  const tabPanels = [];
  for (let i = 0; i < tabPanelIds.length; i++) {
    const panelId = tabPanelIds[i];
    let panel = tabsBlock.querySelector(`#${panelId}`);
    // Defensive: fallback if panel not found by id
    if (!panel) {
      // fallback: take the nth tabpanel
      panel = tabsBlock.querySelectorAll('[role="tabpanel"]')[i];
    }
    // Find the main content for this tab
    // Prefer any <article> inside, otherwise the panel itself
    let tabContent = null;
    if (panel) {
      const article = panel.querySelector('article');
      if (article) {
        tabContent = article;
      } else {
        tabContent = panel;
      }
    }
    tabPanels.push(tabContent);
  }

  // Build the table cells array
  const cells = [];
  // Header row exactly as required
  cells.push(['Tabs (tabs6)']);
  // Each tab: label, content (reference real DOM elements)
  for (let i = 0; i < tabLabels.length; i++) {
    // If for any reason content is missing, add an empty div to preserve the structure
    const content = tabPanels[i] || document.createElement('div');
    cells.push([tabLabels[i], content]);
  }

  // Create the block table and replace the original tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
