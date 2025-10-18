/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab headers (tab labels)
  const tabHeaders = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (tab content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if counts match
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Build the table rows
  const rows = [];
  // Always use the required header row
  rows.push(['Tabs (tabs27)']);

  // For each tab, add a row with [label, content]
  for (let i = 0; i < tabHeaders.length; i++) {
    const label = tabHeaders[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // For content, use the entire tabpanel content
    // Remove the tabpanel wrapper but keep its children
    const contentNodes = Array.from(panel.childNodes);
    // If only one child and it's a div.contentfragment, use that directly
    let content;
    if (contentNodes.length === 1 && contentNodes[0].classList && contentNodes[0].classList.contains('contentfragment')) {
      content = contentNodes[0];
    } else {
      // Otherwise, wrap in a fragment
      const frag = document.createDocumentFragment();
      contentNodes.forEach(node => frag.appendChild(node.cloneNode(true)));
      content = frag;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs container with the block
  tabsContainer.replaceWith(block);
}
