/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];

  // Header row: block name only
  const headerRow = ['Tabs (tabs30)'];
  rows.push(headerRow);

  // Each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Extract the actual tab content
    // Find the .cmp-contentfragment inside the panel
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Remove the repeated h3.cmp-contentfragment__title if present
      const fragmentClone = document.createElement('div');
      Array.from(contentFragment.childNodes).forEach(node => {
        // Exclude the h3.cmp-contentfragment__title
        if (!(node.nodeType === 1 && node.matches('h3.cmp-contentfragment__title'))) {
          fragmentClone.appendChild(node.cloneNode(true));
        }
      });
      tabContent = fragmentClone;
    } else {
      // fallback: use the panel itself
      tabContent = panel.cloneNode(true);
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
