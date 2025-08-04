/* global WebImporter */
export default function parse(element, { document }) {
  // Find cmp-tabs root inside the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  const tabLabels = tabEls.map(tab => tab.textContent.trim());

  // Get tab panel contents in the same order as tab labels
  const tabContents = tabEls.map(tab => {
    const panelId = tab.getAttribute('aria-controls');
    if (!panelId) return '';
    const panel = tabsRoot.querySelector(`#${panelId}`);
    if (!panel) return '';
    // Get all children that aren't empty text/script/style
    const nodes = Array.from(panel.childNodes).filter(n => {
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      if (n.nodeType === Node.ELEMENT_NODE && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE')) return false;
      return true;
    });
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;
    return '';
  });

  // Build the table: header, labels row, content row
  const cells = [];
  cells.push(['Tabs (tabs35)']);
  cells.push(tabLabels);
  cells.push(tabContents);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
