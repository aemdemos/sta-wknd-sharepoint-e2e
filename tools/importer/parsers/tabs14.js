/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find label elements (tab labels)
  const tabLabelEls = Array.from(
    tabsBlock.querySelectorAll('ol.cmp-tabs__tablist > li[role="tab"]')
  );

  // Find tab panel elements (tab content)
  const tabPanelEls = Array.from(
    tabsBlock.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Guard for empty or unmatchable tab/panel count
  if (tabLabelEls.length === 0 || tabPanelEls.length === 0) return;

  // Header row with correct block name
  const cells = [['Tabs (tabs14)']];

  // For each tab, add a row: [tab label, content]
  for (let i = 0; i < tabLabelEls.length; i++) {
    const labelEl = tabLabelEls[i];
    const panelEl = tabPanelEls[i];
    if (!labelEl || !panelEl) continue; // Defensive
    // Tab label: text only
    const tabLabel = labelEl.textContent.trim();
    // Tab content: use the main .cmp-contentfragment/article (the main content block) if present,
    // else use the panelEl itself
    let tabContent;
    const contentFragment = panelEl.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = panelEl;
    }
    cells.push([tabLabel, tabContent]);
  }

  // Create table and replace original tabs block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
