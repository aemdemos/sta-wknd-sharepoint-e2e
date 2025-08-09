/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main Tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Find tab panels (in order as they appear)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // The first row is the block header, matching example
  const cells = [
    ['Tabs (tabs23)']
  ];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanels[i];
    let tabContentCell = null;

    if (tabPanel) {
      // Find the main contentfragment/article content inside the tab
      const cf = tabPanel.querySelector('.cmp-contentfragment, .contentfragment');
      if (cf) {
        // Collect all children except h3 titles
        // If contentfragment__elements exists, use it
        const elements = cf.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          tabContentCell = elements;
        } else {
          // Fallback: remove h3 and keep the rest
          const fragment = document.createDocumentFragment();
          Array.from(cf.children).forEach(child => {
            if (child.tagName !== 'H3') {
              fragment.appendChild(child);
            }
          });
          tabContentCell = fragment;
        }
      } else {
        // Fallback: use all tabPanel children (reference, not clone)
        const fragment = document.createDocumentFragment();
        Array.from(tabPanel.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)) {
            fragment.appendChild(node);
          }
        });
        tabContentCell = fragment;
      }
    } else {
      tabContentCell = document.createTextNode(''); // Empty cell if missing
    }
    cells.push([label, tabContentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
