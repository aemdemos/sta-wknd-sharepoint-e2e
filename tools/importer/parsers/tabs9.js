/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > .cmp-tabs__tabpanel'));

  // Build the table: first row is header, then each tab row is [label, content]
  const cells = [['Tabs (tabs9)']];

  for (let i = 0; i < tabLabels.length; i++) {
    // Build label cell
    const labelEl = document.createElement('strong');
    labelEl.textContent = tabLabels[i];
    // Build content cell (prefer article)
    let content = '';
    if (tabPanels[i]) {
      const cf = tabPanels[i].querySelector('article.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // fallback: all non-empty elements/text
        const children = Array.from(tabPanels[i].childNodes).filter(
          node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
        );
        content = (children.length === 1) ? children[0] : (children.length > 1 ? children : '');
      }
    }
    cells.push([labelEl, content]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
