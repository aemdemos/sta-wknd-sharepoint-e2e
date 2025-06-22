/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block: <div class="cmp-tabs" ...>
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels: <li class="cmp-tabs__tab">
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels: <div class="cmp-tabs__tabpanel">
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare table header row
  const headerRow = ['Tabs (tabs27)'];

  // Prepare rows for each tab: [label, content]
  const rows = [headerRow];
  tabLabels.forEach((tab, idx) => {
    // Tab label text
    const labelText = tab.textContent.trim();
    // Corresponding panel (may be missing)
    let contentPanel = tabPanels[idx] || document.createElement('div');

    // Try to grab the main content area of the panel, usually <article> inside contentfragment
    let contentEl = contentPanel.querySelector('article');
    if (!contentEl) {
      // fallback to first child or the panel itself if empty
      contentEl = contentPanel.querySelector('.contentfragment') || contentPanel;
    }
    rows.push([labelText, contentEl]);
  });

  // Create the block table and replace the original tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
