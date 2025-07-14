/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels from the tablist
  const tabLabelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  // Get all panels corresponding to the tabs
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // If number of labels and panels don't match, bail
  if (tabLabelEls.length !== tabPanels.length || tabLabelEls.length === 0) return;

  // Header row: block name, exactly as in the example
  const rows = [["Tabs (tabs26)"]];

  // Each subsequent row: [label, content]
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i].textContent.trim();
    const panel = tabPanels[i];
    // Reference the main contentfragment/article inside the panel
    let contentEl = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (!contentEl) {
      // fallback: pick first non-empty, non-grid child
      for (const child of panel.children) {
        if (child.textContent.trim() || child.querySelector('img, p, h1, h2, h3, h4, h5, ul, ol')) {
          contentEl = child;
          break;
        }
      }
    }
    if (!contentEl) contentEl = panel; // fallback
    rows.push([label, contentEl]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsRoot.replaceWith(table);
}
