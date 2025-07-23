/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the .cmp-tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 2. Get tab labels (from tablist > li)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // 3. Get tab panels (tabpanel divs) in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // 4. Build header row, then a row per tab [label, content]
  const cells = [];
  cells.push(['Tabs (tabs30)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // Use the panel's existing content as a block
      // Remove any empty text nodes at start/end
      const nodes = Array.from(panel.childNodes).filter(node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '');
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else if (nodes.length > 1) {
        // Use a fragment to keep all content
        const frag = document.createDocumentFragment();
        nodes.forEach(node => frag.appendChild(node));
        contentCell = Array.from(frag.childNodes);
      } else {
        contentCell = '';
      }
    } else {
      contentCell = '';
    }
    cells.push([label, contentCell]);
  }

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element in the DOM
  element.replaceWith(block);
}
