/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Tab headers
  const tabHeaders = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only keep panels that have a corresponding tab header
  const panels = tabPanels.filter(panel => {
    const labelledby = panel.getAttribute('aria-labelledby');
    return tabHeaders.find(tab => tab.id === labelledby);
  });

  // Build rows: First row is always header
  const cells = [['Tabs (tabs30)']];

  tabHeaders.forEach((tab) => {
    // Tab label
    const tabLabel = tab.textContent.trim();

    // Find corresponding panel
    const panel = panels.find(p => p.getAttribute('aria-labelledby') === tab.id);
    if (!panel) return;

    // Tab content: grab everything inside the tabpanel
    let tabContent;
    const contentFragment = panel.querySelector('.cmp-contentfragment, article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }

    cells.push([tabLabel, tabContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
