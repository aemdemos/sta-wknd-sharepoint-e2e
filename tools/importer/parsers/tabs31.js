/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs, [class*="tabs"]');
  if (!tabsContainer) return;

  // Find the cmp-tabs element (actual tabs block)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Header row: must match block name exactly
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, build a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();
    // Tab panel content
    const panelEl = tabPanels[idx];

    // Defensive: find the main contentfragment/article inside the panel
    let tabContent = null;
    // Try to find a contentfragment/article
    const cf = panelEl.querySelector('.contentfragment, article');
    if (cf) {
      tabContent = cf;
    } else {
      // Fallback: use panelEl itself
      tabContent = panelEl;
    }

    // Reference the actual DOM node, do not clone or create new elements
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
