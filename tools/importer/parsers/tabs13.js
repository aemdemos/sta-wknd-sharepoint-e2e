/* global WebImporter */
export default function parse(element, { document }) {
  // Find the OUTER 'tabs' wrapper (the one that should be replaced)
  const tabsOuter = element.querySelector('.tabs');
  if (!tabsOuter) return;

  // Find the cmp-tabs inside
  const tabsBlock = tabsOuter.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabelEls = Array.from(tablist.querySelectorAll('.cmp-tabs__tab'));
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tab panels in order
  const panels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Compose table rows
  const headerRow = ['Tabs (tabs13)'];
  const tabRows = tabLabels.map((label, idx) => {
    const panel = panels[idx];
    let tabContent = '';
    if (panel) {
      // Reference existing contentfragment/article if present, else panel
      const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment') || panel;
      tabContent = cf;
    }
    return [label, tabContent];
  });
  // Create the table
  const cells = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the OUTER tabs wrapper with the table
  tabsOuter.replaceWith(table);
}
