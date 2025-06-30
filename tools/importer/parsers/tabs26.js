/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block that contains the .cmp-tabs
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Find the tab labels (li elements inside ol.cmp-tabs__tablist)
  const tabList = cmpTabs.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children) : [];
  if (!tabLabels.length) return;

  // Find tab panels (content sections for each tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );
  if (!tabPanels.length) return;
  
  // Build the header row with block name exactly as required
  const headerRow = ['Tabs (tabs26)'];

  // Build the tab label row: get only the textContent of each label
  const tabLabelRow = tabLabels.map(label => {
    // keep the text as a <strong> for visual parity and accessibility (as in the sample screenshot)
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    return strong;
  });

  // For each tab panel, extract its content as a node array
  // Per guidelines: reference the existing elements directly, combine multiple pieces of content in a single cell
  function getPanelContent(panel) {
    // Try to get the <article> with cmp-contentfragment if present
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) return [contentFragment];
    // Otherwise, include all children except empty grid wrappers (which have no visible content)
    const usefulChildren = Array.from(panel.children).filter(child => {
      // Exclude empty grid wrappers and divs with no useful content
      if (child.classList.contains('aem-Grid')) return false;
      if (child.childElementCount === 0 && child.textContent.trim() === '') return false;
      return true;
    });
    // fallback: if nothing, include the panel itself
    return usefulChildren.length ? usefulChildren : [panel];
  }
  const tabContentRow = tabPanels.map(panel => getPanelContent(panel));

  // Compose final cells array: 2 columns, N+1 rows (header + N tabs)
  const cells = [
    headerRow
  ];
  for (let i = 0; i < tabLabels.length; i++) {
    cells.push([
      tabLabelRow[i],
      tabContentRow[i]
    ]);
  }

  // Generate the table using the global helper
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabsWrapper with the new block table
  tabsWrapper.replaceWith(table);
}
