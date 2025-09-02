/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll(':scope > li')).map(li => li.textContent.trim());

  // Get all tab panels in DOM order
  const tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > div[data-cmp-hook-tabs="tabpanel"]'));

  // Compose the header row as in the markdown example (block name only)
  const headerRow = ['Tabs (tabs29)'];

  // Compose a row for each tab: [tab label, tab content]
  const rows = tabLabels.map((label, idx) => {
    // Reference the panel at this index
    const panel = tabPanels[idx];
    let contentCell = '';
    if (panel) {
      // Prefer to reference the <article> inside the panel if present
      const article = panel.querySelector('article');
      if (article) {
        contentCell = article;
      } else {
        // If not, use all children nodes of the panel
        const children = Array.from(panel.childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim() !== '');
        contentCell = children.length === 1 ? children[0] : children;
      }
    }
    return [label, contentCell];
  });

  // Build the block table
  const tableData = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the .cmp-tabs element with the block table
  tabsBlock.replaceWith(blockTable);
}
