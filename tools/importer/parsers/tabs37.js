/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  if (!tabLabels.length) return;

  // Get the tab panels (should match order of tabLabels)
  let tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > .cmp-tabs__tabpanel'));
  if (tabPanels.length === 0) {
    // fallback: try all descendants (in order)
    tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  }
  if (tabPanels.length !== tabLabels.length) return;

  // Build the table: header row, then one row per tab (label, content)
  const cells = [
    ['Tabs (tabs37)']
  ];

  for (let i = 0; i < tabLabels.length; i++) {
    // Create a label element
    const label = document.createElement('span');
    label.textContent = tabLabels[i].textContent.trim();

    // Gather content for this tab
    const panel = tabPanels[i];
    const contentNodes = [];
    for (const node of panel.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'DIV' && node.children.length === 0 && node.textContent.trim() === '') continue;
        contentNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        contentNodes.push(document.createTextNode(node.textContent));
      }
    }
    let contentCell = null;
    if (contentNodes.length === 1) contentCell = contentNodes[0];
    else if (contentNodes.length > 1) contentCell = contentNodes;
    else contentCell = panel;
    cells.push([label, contentCell]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
