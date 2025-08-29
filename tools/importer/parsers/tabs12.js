/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Find tab labels from tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []);

  // Find tab panels -- each contains the tab content
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row exactly as requested
  const headerRow = ['Tabs (tabs12)'];
  
  // For robustness, ensure labels and panels are paired by DOM order, but also label text
  let rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const labelText = labelEl ? labelEl.textContent.trim() : '';
    const panel = tabPanels[i];
    // If there's no panel, just use empty string
    let contentCell;
    if (panel) {
      // Find the cmp-contentfragment/article (should be a single root), else use panel itself
      let cf = panel.querySelector('article, .cmp-contentfragment');
      // Only reference the existing element, do not clone
      contentCell = cf ? cf : panel;
    } else {
      contentCell = '';
    }
    rows.push([labelText, contentCell]);
  }
  
  // Compose cells array for the block table
  const cells = [headerRow, ...rows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  cmpTabs.replaceWith(block);
}
