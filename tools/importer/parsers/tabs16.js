/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (tab titles) from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabTitles = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tab panels (content per tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  if (tabPanels.length !== tabTitles.length) {
    // Defensive: the number of tabs and panels should match
    // If not, try to proceed but only for the minimum count
    const n = Math.min(tabTitles.length, tabPanels.length);
    tabTitles.length = n;
    tabPanels.length = n;
  }

  // Table header: block name exactly as required
  const headerRow = ['Tabs (tabs16)'];

  // Build rows: each row is [label, content] for a tab
  const panelRows = tabPanels.map((panel, idx) => {
    // Tab label in first cell
    const label = tabTitles[idx] ? tabTitles[idx].textContent.trim() : '';

    // For content: use all child nodes of the tabpanel (preserving all HTML and images)
    // But, prefer to reference the .contentfragment (article) when available
    let contentElem = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      contentElem = contentFragment;
    } else {
      // If no contentfragment, gather all childNodes into a <div> for the cell
      const wrapper = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        // Only append nodes that are not empty text
        if (
          node.nodeType === 1 ||
          (node.nodeType === 3 && node.textContent.trim())
        ) {
          wrapper.appendChild(node);
        }
      });
      contentElem = wrapper.childNodes.length === 1 ? wrapper.firstChild : wrapper;
    }
    return [label, contentElem];
  });

  // Compose table cells: header + per-tab rows
  const cells = [headerRow, ...panelRows];

  // Create table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table block
  tabsBlock.replaceWith(table);
}
