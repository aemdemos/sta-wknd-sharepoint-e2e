/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (array)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }
  // Get tab panels in order as array
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Compose the cells array.
  // First row: header
  const cells = [['Tabs (tabs39)']];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((label, i) => {
    // Make label element
    const strong = document.createElement('strong');
    strong.textContent = label;
    let contentCell = '';
    const panel = tabPanels[i];
    if (panel) {
      // Find the article/contentfragment containing the content
      const article = panel.querySelector('article');
      if (article) {
        const elements = article.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          // Gather all meaningful children (skip empty .aem-Grid wrappers)
          const meaningfulNodes = [];
          Array.from(elements.children).forEach(child => {
            if (
              child.classList.contains('aem-Grid') && child.textContent.trim() === ''
            ) return;
            if (
              child.tagName === 'DIV' &&
              child.querySelector('.aem-Grid') &&
              child.textContent.trim() === ''
            ) return;
            meaningfulNodes.push(child);
          });
          if (meaningfulNodes.length > 0) {
            contentCell = meaningfulNodes;
          } else {
            // fallback: use all element children
            contentCell = Array.from(elements.childNodes).filter(n => n.nodeType !== 8);
          }
        } else {
          // fallback: all article children
          contentCell = Array.from(article.childNodes).filter(n => n.nodeType !== 8);
        }
      } else {
        // fallback: all panel children
        contentCell = Array.from(panel.childNodes).filter(n => n.nodeType !== 8);
      }
    }
    cells.push([strong, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
