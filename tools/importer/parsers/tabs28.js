/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get tab panel elements (one per tab, in order)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: if tabs/contents don't match, abort
  if (tabLabels.length !== tabPanels.length) return;

  // Compose the table header
  const headerRow = ['Tabs (tabs28)'];
  // Compose the tab labels row (second row)
  const labelsRow = tabLabels;

  // Compose content row (single row, each cell = tab panel content)
  // For each tab panel, extract the main visual content (excluding tab title h3)
  const contentRow = tabPanels.map(panel => {
    // Panels contain a .cmp-contentfragment (article)
    const frag = panel.querySelector('.cmp-contentfragment');
    if (frag) {
      // Remove the .cmp-contentfragment__title (the tab label again)
      const children = Array.from(frag.children).filter(child =>
        !child.classList.contains('cmp-contentfragment__title')
      );
      // Most content is inside .cmp-contentfragment__elements
      let contentArr = [];
      children.forEach(child => {
        if (child.classList.contains('cmp-contentfragment__elements')) {
          // Get all child nodes, filter out empty grid wrappers
          Array.from(child.childNodes).forEach(node => {
            if (node.nodeType === 1) {
              // Remove empty grid wrappers
              if (
                (node.classList.contains('aem-Grid')) ||
                (node.classList.contains('aem-GridColumn'))
              ) return;
              // Sometimes there's an extra <div> wrapper that is empty
              if (node.tagName === 'DIV' && node.innerHTML.trim() === '') return;
              contentArr.push(node);
            } else if (node.nodeType === 3 && node.textContent.trim() !== '') {
              contentArr.push(node);
            }
          });
        } else {
          if (child.nodeType === 1) {
            if (child.tagName === 'DIV' && child.innerHTML.trim() === '') return;
            contentArr.push(child);
          } else if (child.nodeType === 3 && child.textContent.trim() !== '') {
            contentArr.push(child);
          }
        }
      });
      // If only one element, return it, else array
      if (contentArr.length === 1) return contentArr[0];
      if (contentArr.length > 1) return contentArr;
      // fallback: if somehow nothing, just the panel
      return panel;
    } else {
      // fallback: just use the panel
      return panel;
    }
  });

  // Compose the cells array: header, labels, content
  const cells = [headerRow, labelsRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
