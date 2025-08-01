/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs component inside the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and panel elements
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabPanelEls = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  // Map tab panels by id for fast access
  const panelMap = {};
  tabPanelEls.forEach(panel => {
    panelMap[panel.id] = panel;
  });

  // Prepare tab labels (for the second row, as column headers) and corresponding content fragments (for the content row)
  const tabLabels = tabLabelEls.map(tabLabelEl => tabLabelEl.textContent.trim());
  const tabContents = tabLabelEls.map(tabLabelEl => {
    const panelId = tabLabelEl.getAttribute('aria-controls');
    const tabPanelEl = panelMap[panelId];
    let contentCell = '';
    if (tabPanelEl) {
      // Use the first contentfragment/article, or fallback to the full tabPanel
      const fragment = tabPanelEl.querySelector('.contentfragment, .cmp-contentfragment, article');
      contentCell = fragment || tabPanelEl;
    }
    return contentCell;
  });

  // Structure: first row = single cell header, second row = tab labels (columns), third row = tab contents (columns)
  const headerRow = ['Tabs (tabs7)'];
  const labelRow = tabLabels;
  const contentRow = tabContents;
  const rows = [headerRow, labelRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
