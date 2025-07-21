/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find the tab labels (from tablist li)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []).map(
    li => li.textContent.trim()
  );

  // Find all tab panels, order matters
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"]')
  );
  
  // Prepare the block table rows
  const cells = [];
  // Header row
  cells.push(['Tabs (tabs7)']);

  // For each tab, create content row: [tab label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Pull all children except empty grid wrappers and script/style
      // Take all non-empty, non-grid, non-script/style elements
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === 1) {
          // skip AEM grid wrappers and empty divs
          if (
            node.classList.contains('aem-Grid') ||
            node.classList.contains('aem-Grid--12') ||
            node.tagName === 'SCRIPT' ||
            node.tagName === 'STYLE' ||
            node.innerHTML.trim() === ''
          ) {
            return false;
          }
          return true;
        }
        // include text nodes if not empty
        if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
          return true;
        }
        return false;
      });
      // If only one real content node, put directly, otherwise as array
      if (contentNodes.length === 1) {
        content = contentNodes[0];
      } else if (contentNodes.length > 1) {
        content = contentNodes;
      } else {
        // fallback to panel itself
        content = panel;
      }
    } else {
      content = '';
    }
    cells.push([label, content]);
  }

  // Create the tabs block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
