/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  let tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabs = tabsRoot;
  // If .tabs.panelcontainer is a wrapper, get the .cmp-tabs child
  if (tabsRoot && !tabsRoot.classList.contains('cmp-tabs')) {
    tabs = tabsRoot.querySelector(':scope > .cmp-tabs');
  }
  if (!tabs) return; // Defensive: no tabs block found

  // Get all tab labels (li[role=tab])
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return; // Defensive: tablist missing
  const tabLabels = Array.from(tablist.querySelectorAll('li[role="tab"]'));

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"]'));
  if (tabPanels.length !== tabLabels.length) {
    // Defensive: fallback, only use matching number of panels and labels
    const minLen = Math.min(tabPanels.length, tabLabels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // HEADER: block name exactly as provided in the prompt
  const headerRow = ['Tabs (tabs23)'];

  // Row: Tab labels as <strong> elements, using the existing textContent
  const tabLabelCells = tabLabels.map(tab => {
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // Row: Tab panel content
  const tabContentCells = tabPanels.map(panel => {
    // Try to find the main content element (usually <article>), otherwise use panel
    let content = panel.querySelector('article, .contentfragment, .cmp-contentfragment');
    if (content) {
      return content;
    } else {
      // Defensive: If no contentfragment is found, use the panel itself
      return panel;
    }
  });

  // Compose the table: 1 header row, 1 row for labels, 1 row for contents
  const cells = [
    headerRow,
    tabLabelCells,
    tabContentCells
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.parentNode.replaceChild(table, element);
}
