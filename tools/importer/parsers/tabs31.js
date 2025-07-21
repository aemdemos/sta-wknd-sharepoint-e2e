/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the passed element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li.cmp-tabs__tab)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];

  // Compose the header row: block name only, as per requirements
  const headerRow = ['Tabs (tabs31)'];
  const cells = [headerRow];

  // For each tab, get label and corresponding panel content
  tabLabelEls.forEach((labelEl) => {
    // Tab label: textContent
    const label = labelEl.textContent.trim();
    // Find the corresponding .cmp-tabs__tabpanel via the aria-controls attr
    const panelId = labelEl.getAttribute('aria-controls');
    const panel = tabs.querySelector(`#${panelId}`);
    let content;
    if (panel) {
      // Use the full panel element's contents
      // Remove tab-panel-only attributes to avoid confusion in output
      panel.removeAttribute('role');
      panel.removeAttribute('aria-labelledby');
      panel.removeAttribute('tabindex');
      panel.removeAttribute('data-cmp-hook-tabs');
      panel.removeAttribute('data-cmp-data-layer');
      panel.removeAttribute('class');
      panel.removeAttribute('aria-hidden');
      // Use all direct children (not just .contentfragment) to support future variations
      // If there's only one child, use it directly, else use all
      if (panel.childNodes.length === 1) {
        content = panel.firstChild;
      } else {
        // Filter out empty text nodes
        content = Array.from(panel.childNodes).filter(node => {
          return !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '');
        });
      }
    } else {
      content = '';
    }
    cells.push([label, content]);
  });

  // Create the block table and replace the tabs element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(table);
}
