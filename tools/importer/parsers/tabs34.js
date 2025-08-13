/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block; ensure it's present
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row for block table, matching the block name exactly as required
  const headerRow = ['Tabs (tabs34)'];

  // Extract tab labels from top tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Extract tab panels (tab content), order is important
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If number of labels doesn't match panels, handle gracefully
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Compose rows: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < numTabs; i += 1) {
    const label = tabLabels[i].textContent.trim();
    // For content, use the article inside the tabpanel if present, else use the panel
    const panel = tabPanels[i];
    let content = null;
    // Only include meaningful content, not empty wrappers
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // fallback: all children of the panel
      // But skip scripts or elements with no visible content
      const children = Array.from(panel.childNodes).filter(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      );
      if (children.length === 1) {
        content = children[0];
      } else if (children.length > 1) {
        content = children;
      } else {
        content = '';
      }
    }
    rows.push([label, content]);
  }

  // Compose cells: header row + tab rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block only (not the full section)
  tabsBlock.replaceWith(table);
}