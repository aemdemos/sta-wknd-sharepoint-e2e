/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li.cmp-tabs__tab').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab panels (content)
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');
  if (tabLabels.length !== tabPanels.length) return;

  const ELEMENT_NODE = 1;
  const TEXT_NODE = 3;

  // Header row: block name exactly as specified
  const headerRow = ['Tabs (tabs28)'];

  // The second row: tab labels (as in example)
  const labelRow = [...tabLabels];

  // Each subsequent row: [tabLabel, tabContent]
  const rows = [headerRow, labelRow];

  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    // Get all non-empty content nodes
    const contentNodes = [];
    Array.from(panel.childNodes).forEach(node => {
      if (node.nodeType === TEXT_NODE && !node.textContent.trim()) return;
      if (
        node.nodeType === ELEMENT_NODE &&
        (node.classList.contains('aem-Grid') || node.classList.contains('aem-Grid--default--12')) &&
        node.childElementCount === 0
      ) {
        return;
      }
      contentNodes.push(node);
    });
    let contentCell = '';
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    }
    rows.push([label, contentCell]);
  });

  // Create the Tabs block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
