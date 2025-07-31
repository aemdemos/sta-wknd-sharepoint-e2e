/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find all tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  // Find all tab panels (contents), order should match tab labels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  if (!tabLabelEls.length || !tabPanels.length || tabLabelEls.length !== tabPanels.length) return;

  // Compose the header row as required
  const headerRow = ['Tabs (tabs13)'];

  // For each tab: [label, content] row, no label summary row, no empty cells
  const tabRows = tabLabelEls.map((tabEl, i) => {
    // Use <strong> for active tab label (as in example, optional)
    let labelCell;
    if (tabEl.classList.contains('cmp-tabs__tab--active')) {
      const strong = document.createElement('strong');
      strong.textContent = tabEl.textContent.trim();
      labelCell = strong;
    } else {
      labelCell = tabEl.textContent.trim();
    }
    // The corresponding content panel (usually a single <article>)
    const panel = tabPanels[i];
    const contentEl = panel.querySelector('article') || panel;
    return [labelCell, contentEl];
  });

  // Structure: header row, then one row per tab, each with [label, content]
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
