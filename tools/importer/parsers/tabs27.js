/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  const cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure matching labels and panels
  if (tabLabels.length !== tabPanels.length) {
    // If mismatch, fallback: only use as many as both exist
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Build rows for the block table
  const rows = [];
  // Header row as per spec
  rows.push(['Tabs (tabs27)']);

  // For each tab, extract label and content
  tabLabels.forEach((labelEl, i) => {
    // Tab label
    const tabLabel = labelEl.textContent.trim();
    // Tab content: use the entire contentfragment/article inside the tabpanel
    const panel = tabPanels[i];
    // Defensive: find the main content area inside the tabpanel
    let tabContent = null;
    // Prefer the article.cmp-contentfragment if present
    tabContent = panel.querySelector('article.cmp-contentfragment') || panel;
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element
  tabsContainer.replaceWith(block);
}
