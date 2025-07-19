/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab list (labels)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];

  // Get tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the header row
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabelEls.length; i++) {
    // Tab label in first cell (strong)
    const label = tabLabelEls[i] ? tabLabelEls[i].textContent.trim() : '';
    const labelEl = document.createElement('strong');
    labelEl.textContent = label;

    // Tab content in second cell (reference the existing .contentfragment/article, or the panel itself)
    let contentCell = '';
    const panel = tabPanels[i];
    if (panel) {
      // Prefer a .contentfragment element or article, else use the panel itself
      let cf = panel.querySelector('.contentfragment') || panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        contentCell = panel;
      }
    }

    rows.push([labelEl, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
