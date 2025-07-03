/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Find tab label elements
  const tabList = tabsWrapper.querySelector('ol.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li'));

  // Find tabpanel elements, in display order as they appear in the DOM
  const tabPanelEls = Array.from(tabsWrapper.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]'));

  // Header row must match the block name from instructions
  const headerRow = ['Tabs (tabs2)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i]?.textContent?.trim() || '';
    const panel = tabPanelEls[i];
    let contentCell = '';
    if (panel) {
      // Use all direct children of the panel except for possible empty .aem-Grid wrappers
      // Prefer the contentfragment/article if present
      const contentFragment = panel.querySelector('article.cmp-contentfragment, .cmp-contentfragment');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        // Otherwise use all child nodes (elements/text) that would be visually present
        // Exclude empty grid containers
        const meaningfulNodes = Array.from(panel.childNodes).filter(node => {
          if (node.nodeType === 3) return node.textContent.trim(); // text node
          if (node.nodeType === 1) {
            // element
            if (node.classList.contains('aem-Grid') || node.classList.contains('aem-Grid--12')) {
              // skip empty grid containers
              return node.textContent.trim();
            }
            return true;
          }
          return false;
        });
        if (meaningfulNodes.length === 1) {
          contentCell = meaningfulNodes[0];
        } else if (meaningfulNodes.length > 1) {
          contentCell = meaningfulNodes;
        }
      }
    }
    rows.push([label, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsWrapper.replaceWith(table);
}
