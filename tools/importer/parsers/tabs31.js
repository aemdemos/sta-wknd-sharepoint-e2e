/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  // Get tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  // Defensive: if there are no tabs, abort
  if (tabLabelEls.length === 0) return;
  // Find all tabpanel elements
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  // Defensive: if there are no panels, abort
  if (tabPanels.length === 0) return;
  // Helper to map tabPanel to label
  function getTabLabel(tabPanel) {
    // Should always match tab label
    const labelId = tabPanel.getAttribute('aria-labelledby');
    if (!labelId) return '';
    const labelEl = document.getElementById(labelId);
    return labelEl ? labelEl.textContent.trim() : '';
  }
  // Each tab: [label, content]
  const rows = tabPanels.map(tabPanel => {
    // Get label
    const label = getTabLabel(tabPanel);
    // Get tab content: reference the main "contentfragment" child, if present
    let contentEl = tabPanel.querySelector('article.cmp-contentfragment, .cmp-contentfragment, .contentfragment');
    if (!contentEl) {
      // fallback: everything inside tabPanel except aria attributes (should be all content)
      contentEl = tabPanel;
    }
    // Defensive: if empty element, use empty string
    const contentCell = contentEl && contentEl.childNodes.length ? contentEl : '';
    return [label, contentCell];
  });
  // Table header
  const cells = [ ['Tabs (tabs31)'], ...rows ];
  // Create and insert block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(table);
}
