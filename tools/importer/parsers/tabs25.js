/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsPanel = element.querySelector('.tabs.panelcontainer');
  if (!tabsPanel) return;
  const cmpTabs = tabsPanel.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels and tab panels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: must match in length and have at least 1 tab
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row: must be a single cell array
  const headerRow = ['Tabs (tabs25)'];

  // Build each tab row as [label, content], vertical layout
  const tabRows = tabLabels.map((tabLabelEl, idx) => {
    // Use a <strong> for the label
    const strongEl = document.createElement('strong');
    strongEl.textContent = tabLabelEl.textContent.trim();
    // For content: prefer <article.cmp-contentfragment>, else all non-empty children
    const panel = tabPanels[idx];
    let contentCell = null;
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      contentCell = article;
    } else {
      // Fallback: all non-empty child nodes
      const nodes = Array.from(panel.childNodes).filter(n =>
        (n.nodeType === 1 && n.textContent.trim().length > 0) ||
        (n.nodeType === 3 && n.textContent.trim().length > 0)
      );
      contentCell = nodes.length === 1 ? nodes[0] : nodes;
    }
    return [strongEl, contentCell];
  });

  // Compose the table
  const cells = [headerRow, ...tabRows];

  // Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsPanel.replaceWith(block);
}
