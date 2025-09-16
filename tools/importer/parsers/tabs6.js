/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab (label, content)
  const rows = [];
  // Always use the required header
  rows.push(['Tabs (tabs6)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // For content, extract the main content inside the tab panel
    // Usually there's a .contentfragment > article, but fallback to tabPanel itself
    let content = tabPanels[i].querySelector('article');
    if (!content) {
      // fallback: use the tabPanel's children
      content = document.createElement('div');
      Array.from(tabPanels[i].childNodes).forEach((node) => {
        content.appendChild(node.cloneNode(true));
      });
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block
  tabsRoot.replaceWith(table);
}
