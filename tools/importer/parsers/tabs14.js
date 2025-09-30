/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element (the actual tabs block)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row as per block requirements
  rows.push(['Tabs (tabs14)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the content to avoid moving it in DOM
    const contentFragment = document.createElement('div');
    // Find the main contentfragment/article inside the tabpanel
    const cf = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (cf) {
      // Copy only the content inside the contentfragment/article
      Array.from(cf.childNodes).forEach(node => {
        // skip the .cmp-contentfragment__title if present (duplicate of tab title)
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('cmp-contentfragment__title')) return;
        contentFragment.appendChild(node.cloneNode(true));
      });
    } else {
      // fallback: copy all panel content
      Array.from(panel.childNodes).forEach(node => {
        contentFragment.appendChild(node.cloneNode(true));
      });
    }

    rows.push([label, contentFragment]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
