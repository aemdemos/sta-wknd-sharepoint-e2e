/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (the one with class 'cmp-tabs')
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements in .cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Get the tab panels (content for each tab, in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // For each panel, extract the main content (prefer contentfragment__elements, fallback to article or panel)
  const tabContents = tabPanels.map(panel => {
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      const cfElements = cf.querySelector('.cmp-contentfragment__elements');
      if (cfElements && cfElements.children.length > 0) {
        // Remove empty grid wrappers
        const validChildren = Array.from(cfElements.children).filter(child => {
          if (child.classList && (child.classList.contains('aem-Grid') || child.classList.contains('aem-Grid--12') || child.classList.contains('aem-Grid--default--12'))) return false;
          return true;
        });
        if (validChildren.length === 1) return validChildren[0];
        if (validChildren.length > 1) return validChildren;
        return cfElements;
      } else {
        return cf;
      }
    }
    return panel;
  });

  // Carefully build table: header row is a single cell, then one row of tab labels, then one row of tab content
  const rows = [];
  rows.push(['Tabs (tabs38)']);
  rows.push(tabLabels);
  rows.push(tabContents);

  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
