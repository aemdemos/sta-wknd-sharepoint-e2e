/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs (tabs block root)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (li.cmp-tabs__tab)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  // Get all tabpanels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Prepare the table rows
  const rows = [];
  // Header row with block name, exactly as specified
  rows.push(['Tabs (tabs36)']);

  // Each tab is a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label text
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Corresponding panel element
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Find the main content fragment for this tab
      const frag = panel.querySelector('.contentfragment');
      if (frag) {
        // Prefer content inside .cmp-contentfragment__elements (skip h3 title)
        const elements = frag.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          // Use all children of elements, excluding empty AEM grid divs
          const cellContent = [];
          Array.from(elements.childNodes).forEach(node => {
            // Skip aem-Grid and empty divs
            if (node.nodeType === 1 && (node.classList.contains('aem-Grid') || node.classList.contains('aem-GridColumn'))) return;
            if (node.nodeType === 1 && node.tagName === 'DIV' && node.childElementCount === 0 && node.textContent.trim() === '') return;
            if (node.nodeType === 3 && node.textContent.trim() === '') return;
            cellContent.push(node);
          });
          // If only one element, use it directly, else use array
          contentCell = cellContent.length === 1 ? cellContent[0] : cellContent;
        } else {
          // Fallback: use all child nodes after removing h3 title
          const cellContent = [];
          Array.from(frag.childNodes).forEach(node => {
            if (node.nodeType === 1 && node.tagName === 'H3') return;
            cellContent.push(node);
          });
          contentCell = cellContent.length === 1 ? cellContent[0] : cellContent;
        }
      } else {
        // Use all child nodes of the panel (excluding scripts)
        const nodes = Array.from(panel.childNodes).filter(n => !(n.nodeType === 1 && n.tagName === 'SCRIPT'));
        contentCell = nodes.length === 1 ? nodes[0] : nodes;
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
