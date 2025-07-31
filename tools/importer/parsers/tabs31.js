/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels and panels
  const tabList = tabs.querySelector('[role=tablist]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role=tab]'));
  const tabPanels = Array.from(tabs.querySelectorAll('[role=tabpanel]'));

  // Build table: header and one row per tab ([label, content])
  const headerRow = ['Tabs (tabs31)'];
  const rows = tabLabels.map((tab, idx) => {
    const label = tab.textContent.trim();
    let contentCell = '';
    const panel = tabPanels[idx];
    if (panel) {
      // Use all children nodes (including text), preserving layout
      const children = Array.from(panel.children);
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        const wrap = document.createElement('div');
        children.forEach(child => wrap.appendChild(child));
        contentCell = wrap;
      } else {
        contentCell = document.createElement('div');
        contentCell.innerHTML = panel.innerHTML;
      }
    }
    return [label, contentCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
