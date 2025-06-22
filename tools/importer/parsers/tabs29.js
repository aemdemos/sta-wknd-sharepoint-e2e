/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root. It is the div with class 'cmp-tabs'.
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab list (tab labels) and all tab panels (tab contents)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Header row must have two cells to match the number of columns in the tab rows
  const cells = [ ['Tabs (tabs29)', ''] ];

  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Find corresponding panel by aria-controls or by index
    let panel;
    const controlsId = tabLabel.getAttribute('aria-controls');
    if (controlsId) {
      panel = tabsRoot.querySelector('#' + controlsId);
    } else {
      panel = tabPanels[idx];
    }
    if (!panel) return;
    // For the tab content, select the main content block inside the tab panel
    let contentFragment = panel.querySelector('.contentfragment') || panel;
    cells.push([labelText, contentFragment]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
