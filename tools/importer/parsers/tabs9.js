/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels in order
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row: must match block name exactly
  rows.push(['Tabs (tabs9)']);

  // Each tab: [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    // Defensive: skip if panel missing
    if (!panel) return;
    // Extract all visible content from the tab panel
    // Reference the actual DOM nodes, not clones or new elements
    const contentNodes = Array.from(panel.childNodes).filter(
      node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
    );
    // If only one node, use it directly; else, use array
    let tabContent;
    if (contentNodes.length === 1) {
      tabContent = contentNodes[0];
    } else if (contentNodes.length > 1) {
      // Wrap in a fragment for multi-node content
      const frag = document.createDocumentFragment();
      contentNodes.forEach(node => frag.appendChild(node));
      tabContent = frag;
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsContainer.parentElement.replaceWith(table);
}
