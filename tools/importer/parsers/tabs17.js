/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels from the tablist (first-level li or elements with role="tab")
  const tabListEl = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabListEl) {
    tabListEl.querySelectorAll('li, [role=tab]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tabpanels (content for each tab)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Prepare the table rows
  const rows = [
    ['Tabs (tabs17)'] // Header row must match the block name exactly
  ];

  // For each tab, add a row with [label, content]
  tabPanels.forEach((tabpanel, idx) => {
    // Defensive: fallback to "Tab X" if label missing
    const label = tabLabels[idx] || `Tab ${idx + 1}`;
    // Content cell: reference the main content under this tabpanel
    // Prefer the <article> if present, else the first child of tabpanel, else tabpanel itself
    let contentEl = null;
    const article = tabpanel.querySelector('article');
    if (article) {
      contentEl = article;
    } else {
      // Use the div with class 'contentfragment' if present
      const cf = tabpanel.querySelector('.contentfragment');
      if (cf) {
        contentEl = cf;
      } else {
        // fallback: use all children if there are any
        const children = Array.from(tabpanel.children);
        if (children.length === 1) {
          contentEl = children[0];
        } else if (children.length > 1) {
          // For multiple children, reference the tabpanel itself
          contentEl = tabpanel;
        } else {
          // fallback to tabpanel itself
          contentEl = tabpanel;
        }
      }
    }
    rows.push([label, contentEl]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with our table
  tabs.replaceWith(table);
}
