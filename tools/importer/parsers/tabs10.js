/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block inside the given element
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;

  // Find the cmp-tabs inside the .tabs
  const cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab panels in order (they are divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table structure: Header row, then one row per tab [tab label, tab content]
  const table = [];

  // Header row exactly as in block specification
  table.push(['Tabs (tabs10)']);

  // Each subsequent row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let contentCell = '';
    if (tabPanels[i]) {
      // Reference the main content block inside the tabpanel, prefer the <article> (contentfragment), fallback to panel itself
      const fragment = tabPanels[i].querySelector('article');
      contentCell = fragment ? fragment : tabPanels[i];
    }
    table.push([label, contentCell]);
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(table, document);
  tabsWrapper.replaceWith(block);
}
