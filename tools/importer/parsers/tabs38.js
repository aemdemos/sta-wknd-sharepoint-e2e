/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab titles
  const tabTitles = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only pair up as many panels as there are titles
  const tabCount = Math.min(tabTitles.length, tabPanels.length);

  // Build the table rows
  const rows = [];
  // Header row per spec
  rows.push(['Tabs (tabs38)']);

  for (let i = 0; i < tabCount; i++) {
    const title = tabTitles[i];
    const panel = tabPanels[i];

    // For the content cell, extract the main content area of the tab panel
    let content;
    let contentFragment = panel.querySelector('article');
    if (contentFragment) {
      const h3 = contentFragment.querySelector('h3');
      if (h3) h3.remove();
      content = contentFragment.cloneNode(true);
    } else {
      content = panel.cloneNode(true);
    }

    rows.push([title, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
