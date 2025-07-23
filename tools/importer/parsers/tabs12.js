/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist (usually <ol> or <ul> with class cmp-tabs__tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.children);

  // Get the tab panels (content for each tab)
  // Only direct children with class 'cmp-tabs__tabpanel'
  const tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > .cmp-tabs__tabpanel, :scope > div.cmp-tabs__tabpanel'));
  // Fallback: all tab panels in order
  if (tabPanels.length === 0) {
    // fallback: all .cmp-tabs__tabpanel inside tabsBlock
    tabPanels.push(...tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  }

  // Build rows: header, then one row per tab as [label, content]
  const rows = [['Tabs (tabs12)']];

  // Defensive: match panel to label by order
  for (let i = 0; i < tabLabelElements.length; i++) {
    const label = tabLabelElements[i].textContent.trim();
    let panelContent = '';
    const panel = tabPanels[i];
    if (panel) {
      // Find the first cmp-contentfragment, or fallback to entire panel
      const cf = panel.querySelector('.cmp-contentfragment') || panel.querySelector('article.cmp-contentfragment') || panel;
      panelContent = cf;
    }
    rows.push([label, panelContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
