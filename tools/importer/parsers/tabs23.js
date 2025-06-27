/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from ol.cmp-tabs__tablist > li
  const tabList = tabs.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab content panels (order matches tabLabels)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the table array
  // First row: header, exactly as specified
  const table = [
    ['Tabs (tabs23)']
  ];

  // Each subsequent row: [label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let cellContent = '';
    if (panel) {
      // We'll reference the contentfragment/article if possible, otherwise the panel's content
      const cf = panel.querySelector('.contentfragment') || panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        cellContent = cf;
      } else {
        // fallback: create a DocumentFragment containing all real children (not empty grid wrappers)
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(child => {
          // skip empty .aem-Grid wrappers
          if (child.nodeType === 1 && child.matches('div.aem-Grid')) {
            return;
          }
          // skip empty text nodes
          if (child.nodeType === 3 && !child.textContent.trim()) {
            return;
          }
          frag.appendChild(child);
        });
        cellContent = frag.childNodes.length ? frag : panel;
      }
    }
    table.push([label, cellContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(table, document);

  // Replace the original tabs block only
  tabs.replaceWith(block);
}
