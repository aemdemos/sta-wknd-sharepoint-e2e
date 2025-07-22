/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li[role="tab"])
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  );

  // Get all tab panels
  // Each tabpanel is a direct child of .cmp-tabs (or at least inside it), ordered as in the markup
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ignore if no tabs or panels detected
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header as in the spec
  const headerRow = ['Tabs (tabs28)'];
  const cells = [headerRow];

  // For each tab, extract the label and content for the table row
  for (let i = 0; i < tabLabels.length; i++) {
    const tab = tabLabels[i];
    const panel = tabPanels[i];
    if (!tab || !panel) continue; // edge case safeguard

    // Tab label: get the text content
    const label = tab.textContent.trim();

    // Tab content: try to reference the main content element of the tab panel
    // Prefer the main contentfragment/article, fallback to tabpanel itself
    let content = null;
    // If a contentfragment article exists, use it
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      content = article;
    } else {
      // Otherwise, reference the panel div itself (should never happen here, but for robustness)
      content = panel;
    }
    // Add the row: [label, contentElement]
    cells.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabsRoot with the block table
  tabsRoot.replaceWith(block);
}
