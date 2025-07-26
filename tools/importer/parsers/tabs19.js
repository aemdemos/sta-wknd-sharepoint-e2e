/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element in this section
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements in the tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get all tab panels (cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Extract content for each tab, preserving all actual content from each tab panel
  const tabContents = tabPanels.map(panel => {
    // Remove grid wrappers and empty divs, keep only actual content
    const contentNodes = Array.from(panel.childNodes).filter(child => {
      if (child.nodeType === 1) {
        // element node
        if (child.classList && (
          child.classList.contains('aem-Grid') ||
          child.classList.contains('aem-Grid--12') ||
          child.classList.contains('aem-Grid--default--12')
        )) {
          return false;
        }
        // skip empty divs
        if (child.tagName === 'DIV' && child.children.length === 0 && !child.textContent.trim()) {
          return false;
        }
        return true;
      } else if (child.nodeType === 3 && child.textContent.trim()) {
        return true;
      }
      return false;
    });
    // If single node, use it; else, wrap in a <div>
    if (contentNodes.length === 1) {
      return contentNodes[0];
    } else if (contentNodes.length > 1) {
      const div = document.createElement('div');
      contentNodes.forEach(node => div.appendChild(node));
      return div;
    } else {
      return '';
    }
  });

  // Compose the table as per the markdown
  // First row: single header cell
  // Second row: tab labels (one per column)
  // Third row: tab contents (one per column, in same order)
  const cells = [
    ['Tabs (tabs19)'],
    tabLabels,
    tabContents
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
