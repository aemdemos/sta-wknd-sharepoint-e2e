/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within 'element'
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  // Get tab panels (contents), keeping order
  const tabPanelEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Start block table with correct header row
  const rows = [['Tabs (tabs6)']];

  // For each tab, add a row: [label, content]
  tabLabelEls.forEach((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanelEls[idx];
    if (panel) {
      // Use article.cmp-contentfragment if present, else .cmp-contentfragment, else panel
      let contentElem = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.cmp-contentfragment') || panel;
      rows.push([label, contentElem]);
    }
  });

  // Create the block table and replace the tabs block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
