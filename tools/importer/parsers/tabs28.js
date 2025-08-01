/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (class='cmp-tabs') within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  
  // Get tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (!tabLabelEls.length) return;
  
  // Get all tabpanels
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  if (!tabPanels.length) return;

  // Build the block table
  const table = [];
  // Header: single column as in example
  table.push(['Tabs (tabs28)']);

  // Each subsequent row: tab label, tab content (2 columns)
  for (let i = 0; i < tabLabelEls.length; i++) {
    const tabEl = tabLabelEls[i];
    const label = tabEl.textContent.trim();
    const panelId = tabEl.getAttribute('aria-controls');
    const panel = tabs.querySelector(`#${panelId}`);
    if (!panel) continue;
    // Use the main contentfragment/contentfragment or full panel as fallback
    let tabContent = null;
    const mainContent = Array.from(panel.children).find(child => child.classList.contains('contentfragment') || child.classList.contains('cmp-contentfragment'));
    tabContent = mainContent || panel;
    table.push([label, tabContent]);
  }

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
