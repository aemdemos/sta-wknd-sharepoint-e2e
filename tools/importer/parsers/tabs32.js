/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels in order
  const tabLabels = Array.from(tabsBlock.querySelectorAll('[role="tablist"] > li'));
  // Extract tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Table header must match the block name/variant exactly
  const cells = [['Tabs (tabs32)']];

  // Each row below header: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const tabPanel = tabPanels[i];
    if (!label || !tabPanel) continue;

    // Try to extract the main content for this tab
    let content = [];
    // Main contentfragment/article in the tabPanel
    const article = tabPanel.querySelector('article');
    if (article) {
      // Find .cmp-contentfragment__elements if it exists
      const fragmentElements = article.querySelector('.cmp-contentfragment__elements');
      if (fragmentElements) {
        // We'll gather all childNodes except aem-Grid grid placeholders and blank/whitespace text nodes
        const items = Array.from(fragmentElements.childNodes).filter(node => {
          if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.tagName === 'DIV' &&
            node.querySelector('.aem-Grid') &&
            node.textContent.trim() === ''
          ) return false;
          return true;
        });
        // Remove .cmp-contentfragment__title if present
        if (items.length && items[0].classList && items[0].classList.contains('cmp-contentfragment__title')) {
          items.shift();
        }
        // Remove trailing empty grid divs (common in AEM output)
        while (items.length &&
          items[items.length - 1].nodeType === Node.ELEMENT_NODE &&
          items[items.length - 1].tagName === 'DIV' &&
          items[items.length - 1].querySelector('.aem-Grid') &&
          items[items.length - 1].textContent.trim() === ''
        ) {
          items.pop();
        }
        if (items.length === 1) {
          content = items[0];
        } else if (items.length > 1) {
          content = items;
        } else {
          // fallback: include the .cmp-contentfragment__elements
          content = fragmentElements;
        }
      } else {
        // fallback: use all children except .cmp-contentfragment__title
        const children = Array.from(article.children).filter(child => !child.classList.contains('cmp-contentfragment__title'));
        content = children.length === 1 ? children[0] : children;
      }
    } else {
      // fallback: use all children of tabPanel except blank grid blocks, blank nodes
      const candidates = Array.from(tabPanel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.tagName === 'DIV' &&
          node.querySelector('.aem-Grid') &&
          node.textContent.trim() === ''
        ) return false;
        return true;
      });
      content = candidates.length === 1 ? candidates[0] : candidates;
    }
    
    cells.push([label, content]);
  }

  // Construct the table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
