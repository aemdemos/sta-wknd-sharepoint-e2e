/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs;
  if (tabsContainer && tabsContainer.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer;
  } else if (tabsContainer) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  } else {
    cmpTabs = element.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab headers (titles)
  const tabTitles = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process if titles and panels match
  if (tabTitles.length !== tabPanels.length) return;

  // Build rows: first row is header
  const rows = [
    ['Tabs (tabs37)']
  ];

  // For each tab, add a row [title, content]
  for (let i = 0; i < tabTitles.length; i++) {
    const title = tabTitles[i];
    const panel = tabPanels[i];
    // Defensive: clone the content so we don't move it out of the DOM
    const panelContent = document.createElement('div');
    // Find the main content fragment/article inside the tab panel
    const contentFragment = panel.querySelector('article, .cmp-contentfragment, .contentfragment');
    if (contentFragment) {
      panelContent.append(...Array.from(contentFragment.childNodes));
    } else {
      // fallback: use all children
      panelContent.append(...Array.from(panel.childNodes));
    }
    rows.push([title, panelContent]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  cmpTabs.replaceWith(table);
}
