/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim()) : [];

  // Find tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row as in the example
  const headerRow = ['Tabs (tabs8)'];

  // Build one row per tab: [label, content]
  const rows = tabLabels.map((label, idx) => {
    let panel = tabPanels[idx];
    let content = '';
    if (panel) {
      // Prefer a cmp-contentfragment/article if present, else wrap all children
      let frag = panel.querySelector('article.cmp-contentfragment');
      if (frag) {
        content = frag;
      } else {
        // If no article, collect all child nodes
        const wrapper = document.createElement('div');
        Array.from(panel.childNodes).forEach(node => wrapper.appendChild(node.cloneNode(true)));
        content = wrapper;
      }
    }
    return [label, content];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
