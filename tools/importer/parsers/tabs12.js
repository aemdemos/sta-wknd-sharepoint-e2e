/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root element within the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab label elements (li)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  // Get all tab panel elements (div)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build header row: must exactly match the example
  const headerRow = ['Tabs (tabs12)'];
  const cells = [headerRow];

  // For each tab, get label and corresponding content
  tabLabels.forEach((tabLabel) => {
    // Get label text
    const label = tabLabel.textContent.trim();
    // Find corresponding panel by aria-labelledby
    const panelId = tabLabel.id;
    let panel = tabPanels.find(
      (p) => p.getAttribute('aria-labelledby') === panelId
    );
    if (!panel) {
      // fallback: use index (should not happen for valid markup)
      panel = tabPanels[tabLabels.indexOf(tabLabel)];
    }
    if (!panel) return; // skip if no panel found
    // Grab all direct children of the panel (to preserve any structure/images/etc)
    const panelChildren = Array.from(panel.children);
    let tabContent;
    if (panelChildren.length === 1) {
      tabContent = panelChildren[0];
    } else if (panelChildren.length > 1) {
      const frag = document.createDocumentFragment();
      panelChildren.forEach((c) => frag.appendChild(c));
      tabContent = frag;
    } else {
      // fallback: if empty, return an empty string
      tabContent = '';
    }
    cells.push([label, tabContent]);
  });

  // Create the Tabs block table and replace original tabsRoot with it
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(table);
}
