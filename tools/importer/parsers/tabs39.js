/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Header row: exactly one cell with the block name
  const headerRow = ['Tabs (tabs39)'];

  // Gather tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Gather tab panel contents
  const tabPanelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Each row after the header: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, idx) => {
    const panel = tabPanelEls[idx];
    let tabContent;
    if (panel) {
      const article = panel.querySelector('article');
      if (article) {
        tabContent = article;
      } else {
        // If no article, use all direct children except empty grid wrappers, script/style
        const nodes = [];
        Array.from(panel.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
            if (!(node.classList && node.classList.contains('aem-Grid'))) {
              nodes.push(node);
            }
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            nodes.push(document.createTextNode(node.textContent));
          }
        });
        if (nodes.length === 1) tabContent = nodes[0];
        else if (nodes.length > 1) tabContent = nodes;
        else tabContent = '';
      }
    } else {
      tabContent = '';
    }
    return [label, tabContent];
  });

  // Compose the table: header + rows
  const tableArray = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableArray, document);
  // Replace original element with the block table
  element.replaceWith(table);
}
