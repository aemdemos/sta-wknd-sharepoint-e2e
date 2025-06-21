/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (li items inside tablist)
  const tabLabelLis = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  if (!tabLabelLis.length) return;

  // Use ONLY TEXT (or <span>, but text is fine) for tab labels (NO <li> in <td>!)
  const tabLabelRow = tabLabelLis.map((li) => li.textContent.trim());

  // Get all tab panels (order matches tab labels)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Each tab panel's content as a single cell (array length 1)
  const contentRows = tabPanels.map(panel => {
    // Filter out empty text nodes and empty .aem-Grid wrappers
    const nodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains('aem-Grid') &&
        node.childNodes.length === 0
      ) {
        return false;
      }
      return true;
    });
    return [nodes.length === 1 ? nodes[0] : nodes];
  });

  // The header row as in example
  const headerRow = ['Tabs (tabs25)'];
  const cells = [
    headerRow,
    tabLabelRow,
    ...contentRows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
