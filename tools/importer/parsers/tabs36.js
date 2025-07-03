/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);
  // Get the tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  if (tabLabels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Header row: single column with block name
  const cells = [['Tabs (tabs36)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Extract all children of the tab panel, except empty grid/layout stubs
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType !== Node.ELEMENT_NODE) return true;
      // Remove known empty layout wrappers
      const cls = node.classList;
      if (cls.contains('aem-Grid') || cls.contains('aem-Grid--12') || cls.contains('aem-Grid--default--12')) {
        return false;
      }
      return true;
    });

    // If the content is a single .contentfragment or article element, pull its children
    let tabContent = contentNodes;
    if (
      contentNodes.length === 1 &&
      contentNodes[0].nodeType === Node.ELEMENT_NODE &&
      (contentNodes[0].tagName.toLowerCase() === 'article' ||
        contentNodes[0].classList.contains('contentfragment'))
    ) {
      tabContent = Array.from(contentNodes[0].childNodes).filter(n => {
        if (n.nodeType !== Node.ELEMENT_NODE) return true;
        const cl = n.classList;
        if (cl.contains('aem-Grid') || cl.contains('aem-Grid--12') || cl.contains('aem-Grid--default--12')) return false;
        return true;
      });
    }

    if (tabContent.length === 0) tabContent = '';

    cells.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
