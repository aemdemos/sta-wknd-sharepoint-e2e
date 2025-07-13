/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block: it should have class 'cmp-tabs'
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels (in order)
  const tabLabels = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Find tab panels (in order)
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Compose block table: header is ['Tabs (tabs19)'], then one row per tab
  const cells = [];
  cells.push(['Tabs (tabs19)']);
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Find the main content element inside the panel
    // Usually an <article>, but fallback to first child if not found
    let contentElement = panel.querySelector('article, .contentfragment') || panel.firstElementChild || panel;

    // If the first child is a wrapper <div> with a single child, use the deeper element
    while (contentElement && contentElement.children && contentElement.children.length === 1 && contentElement.tagName === 'DIV') {
      contentElement = contentElement.firstElementChild;
    }

    // We want to reference the existing content element, not clone or copy its children
    // But we should skip the h3.cmp-contentfragment__title if present (to match the example)
    let contentForCell;
    if (
      contentElement &&
      contentElement.tagName === 'ARTICLE' &&
      contentElement.querySelector('h3.cmp-contentfragment__title')
    ) {
      // Create a fragment and append all children except the h3.cmp-contentfragment__title
      const frag = document.createDocumentFragment();
      Array.from(contentElement.children).forEach(child => {
        if (!(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'))) {
          frag.appendChild(child);
        }
      });
      contentForCell = frag;
    } else {
      contentForCell = contentElement;
    }

    cells.push([label, contentForCell]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
