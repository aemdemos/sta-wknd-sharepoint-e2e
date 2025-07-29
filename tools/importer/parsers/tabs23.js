/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels, in order
  const tabLabelEls = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get the tab panels, in order (they are .cmp-tabs__tabpanel)
  const tabPanelEls = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build the table: header row is single cell [ 'Tabs (tabs23)' ]
  const tableRows = [
    ['Tabs (tabs23)']  // single column header row
  ];

  // Add tab rows: each row is [tab label, tab content]
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i].textContent.trim();
    const panelEl = tabPanelEls[i];
    let tabContent = null;
    if (panelEl) {
      // Prefer .contentfragment if present, else all panel content
      const contentFragment = panelEl.querySelector('.contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // fallback: wrap all child nodes in a div
        const frag = document.createElement('div');
        Array.from(panelEl.childNodes).forEach(n => frag.appendChild(n));
        tabContent = frag;
      }
    }
    tableRows.push([label, tabContent]);
  }

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
