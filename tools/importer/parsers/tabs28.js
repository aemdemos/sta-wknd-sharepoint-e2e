/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Get tab panels (contents)
  // Each tabpanel is a div[role=tabpanel] in .cmp-tabs
  const tabPanelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the rows for the table
  // First row: block header as one column (per example)
  const rows = [ ['Tabs (tabs28)'] ];

  // For each tab, grab its content and construct [Tab Label, Tab Content] for each row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Try to match tab label to panel by order
    const panelEl = tabPanelEls[i];
    let contentCell = '';
    if (panelEl) {
      // Content is typically a contentfragment > article > .cmp-contentfragment__elements
      const cf = panelEl.querySelector('article.cmp-contentfragment');
      if (cf) {
        // Get all content inside .cmp-contentfragment__elements
        const elementsContainer = cf.querySelector('.cmp-contentfragment__elements');
        if (elementsContainer) {
          // Remove any aem-Grid fillers and empty divs
          const cleanNodes = Array.from(elementsContainer.childNodes).filter(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid')) return false;
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.innerHTML.trim() === '') return false;
            return true;
          });
          if (cleanNodes.length > 0) {
            contentCell = cleanNodes;
          } else {
            contentCell = elementsContainer;
          }
        } else {
          contentCell = cf;
        }
      } else {
        contentCell = panelEl;
      }
    }
    // Push a 2-column row: [Tab Label, Tab Content]
    rows.push([label, contentCell]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
