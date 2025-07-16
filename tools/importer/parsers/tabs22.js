/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;
  
  // Get tab labels
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );
  
  // Get tab panels
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );

  // If mismatch in number, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows for block table: first row is block name
  const cells = [];
  cells.push(['Tabs (tabs22)']);

  // For each tab, push [label, content] row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // For tab content, reference the main content fragment/article if present, else the panel itself
    let tabContent;
    // Prefer article.cmp-contentfragment inside panel, else panel
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback for odd case, reference panel
      tabContent = panel;
    }

    cells.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the outer tabs container with the table
  const tabsOuter = element.querySelector('.tabs');
  if (tabsOuter) {
    tabsOuter.replaceWith(table);
  }
}
