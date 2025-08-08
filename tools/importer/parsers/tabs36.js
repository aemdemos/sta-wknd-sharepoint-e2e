/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (with class 'tabs')
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return; // No tabs block found

  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return; // No cmp-tabs inside tabs block

  // Get all tab labels (li elements with class 'cmp-tabs__tab')
  const tabLabelEls = Array.from(cmpTabs.querySelectorAll(':scope > .cmp-tabs__tablist > li.cmp-tabs__tab'));
  // Get all tab panels (divs with class 'cmp-tabs__tabpanel')
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll(':scope > .cmp-tabs__tabpanel'));

  // Defensive: Only as many rows as we have pairs
  const rowsCount = Math.min(tabLabelEls.length, tabPanelEls.length);

  // Header row as per block specs
  const cells = [[ 'Tabs (tabs36)' ]];

  // Each row: [tab label text, tab content (HTML/element)]
  for (let i = 0; i < rowsCount; i++) {
    // Extract tab label text
    const tabLabel = tabLabelEls[i].textContent.trim();

    // For tab content, use all child nodes of the tab panel (reference, don't clone)
    const panelEl = tabPanelEls[i];
    // Only get real content nodes
    const contentNodes = Array.from(panelEl.childNodes).filter(node => {
      // Filter out whitespace text nodes
      return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
    });
    // Use array if multiple nodes, else single node
    const tabContent = contentNodes.length > 1 ? contentNodes : (contentNodes[0] || '');

    cells.push([tabLabel, tabContent]);
  }

  // Build table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace tabs block with table
  tabsBlock.replaceWith(table);
}
