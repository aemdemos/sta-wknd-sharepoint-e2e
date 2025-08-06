/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 2. Find tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabTabEls = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  if (!tabTabEls.length) return;
  const tabLabels = tabTabEls.map(tab => tab.textContent.trim());

  // 3. Find tab content panels - these match in order with tab labels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: Match only as many panels as tab labels
  const count = Math.min(tabLabels.length, tabPanels.length);

  // 4. For each tab, find its content (reference the .contentfragment or panel children)
  const tabContents = [];
  for (let i = 0; i < count; i++) {
    // The content for the tab is usually a .contentfragment > article
    let content;
    const panel = tabPanels[i];
    // try to find an article (content fragment)
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // If no article, use panel's children (excluding script/style)
      const kids = Array.from(panel.childNodes).filter(n => {
        return (
          n.nodeType === 1 && // ELEMENT_NODE
          n.tagName !== 'SCRIPT' &&
          n.tagName !== 'STYLE' &&
          n.tagName !== 'TEMPLATE'
        ) || n.nodeType === 3; // allow text nodes
      });
      // If only one relevant element, just use that; otherwise use array
      content = kids.length === 1 ? kids[0] : kids;
    }
    tabContents.push(content);
  }

  // 5. Build table: header row, tab label row, tab content row
  const cells = [
    ['Tabs (tabs21)'],
    tabLabels,
    tabContents
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the .cmp-tabs element with the new table
  tabsBlock.replaceWith(block);
}
