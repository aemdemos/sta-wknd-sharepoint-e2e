/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block inside the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (they are inside the tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  // Each li in tabList is a tab
  const tabEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  // Get all tab panels (contents for each tab)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the header row
  const headerRow = ['Tabs (tabs12)'];

  // Prepare the tab rows: each with [label, content]
  const rows = [];
  tabEls.forEach((tabEl) => {
    const label = tabEl.textContent.trim();
    // Each tab li's id is like ...-tab, and the panel has aria-labelledby = li.id
    const panelId = tabEl.getAttribute('aria-controls');
    let panel = null;
    if (panelId) {
      panel = tabs.querySelector(`#${panelId.replace(/\s/g, '')}`);
    }
    // Defensive: fallback to panel by aria-labelledby if needed
    if (!panel) {
      panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tabEl.id);
    }
    // Get the content fragment for that tab
    let tabContent = null;
    if (panel) {
      // Try to find the main content fragment elements for this tab
      const contentFragmentElements = panel.querySelector('.cmp-contentfragment__elements');
      if (contentFragmentElements) {
        tabContent = contentFragmentElements;
      } else {
        // Otherwise, use the contentfragment article if it exists
        const article = panel.querySelector('article');
        if (article) {
          tabContent = article;
        } else {
          // As a last resort, use the entire tabpanel
          tabContent = panel;
        }
      }
      // Extra: If tabContent is a wrapper and only has one useful child, use that
      // (e.g. if .cmp-contentfragment__elements has a single child div, use that div)
      if (tabContent && tabContent.children.length === 1 && tabContent.children[0].tagName === 'DIV') {
        tabContent = tabContent.children[0];
      }
    }
    if (label && tabContent) {
      rows.push([label, tabContent]);
    }
  });

  if (rows.length) {
    // Build the table
    const tableRows = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(tableRows, document);
    // Replace the tabs block with the table
    tabs.replaceWith(table);
  }
}
