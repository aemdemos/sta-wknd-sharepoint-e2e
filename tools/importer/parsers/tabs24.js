/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row: Use block name as required
  rows.push(['Tabs (tabs24)']);

  // For each tab, add label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: Find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the content fragment's children as the tab content
      // (not the fragment wrapper itself)
      const frag = document.createElement('div');
      Array.from(contentFragment.children).forEach(child => {
        frag.appendChild(child.cloneNode(true));
      });
      tabContent = frag;
    } else {
      // Fallback: use the panel's children
      const frag = document.createElement('div');
      Array.from(panel.children).forEach(child => {
        frag.appendChild(child.cloneNode(true));
      });
      tabContent = frag;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
