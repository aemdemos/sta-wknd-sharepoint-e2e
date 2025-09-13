/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block within the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (order matters)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (order matches tabLabels)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build rows: each row is [label, content]
  const rows = tabLabels.map((label, i) => {
    const panel = tabPanels[i];
    // Defensive: if panel missing, skip
    if (!panel) return null;
    // Tab content: use the whole panel's content
    // Find the main contentfragment inside the panel
    const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    let tabContent;
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    return [label, tabContent];
  }).filter(Boolean);

  // Table header
  const headerRow = ['Tabs (tabs13)'];
  const cells = [headerRow, ...rows];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs block with the table
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
