/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (may be direct child or nested)
  let cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs && tabsRoot.classList.contains('cmp-tabs')) {
    cmpTabs = tabsRoot;
  }
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels (in order)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have as many panels as labels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per requirement
  rows.push(['Tabs (tabs28)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the content to avoid moving it in the DOM
    // But since we must reference existing elements, we wrap the children in a div
    const contentDiv = document.createElement('div');
    // Only append element children (skip empty text nodes)
    Array.from(panel.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        contentDiv.appendChild(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Wrap text in a <p>
        const p = document.createElement('p');
        p.textContent = node.textContent;
        contentDiv.appendChild(p);
      }
    });
    // If no element children, fallback to innerHTML
    if (!contentDiv.childNodes.length && panel.innerHTML.trim()) {
      contentDiv.innerHTML = panel.innerHTML;
    }

    rows.push([label, contentDiv]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsRoot with the new table
  tabsRoot.replaceWith(table);
}
