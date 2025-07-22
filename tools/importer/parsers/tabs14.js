/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element directly within the source block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract all tab labels (li's inside the tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Extract all tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll(':scope > [data-cmp-hook-tabs="tabpanel"]')
  );

  // Table rows: header first
  const rows = [ ['Tabs (tabs14)'] ];

  // For each tab, get its label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    
    // Defensive: ensure panel exists
    const panel = tabPanels[i];
    if (!panel) continue;
    
    // Prefer the actual contentfragment content (avoiding the outer panel div)
    let contentEl = null;
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      const cfElements = cf.querySelector('.cmp-contentfragment__elements');
      // If .cmp-contentfragment__elements exists and has children, use it
      if (cfElements && cfElements.children.length > 0) {
        contentEl = cfElements;
      } else {
        // fallback to full contentfragment
        contentEl = cf;
      }
    } else {
      // fallback to panel itself
      contentEl = panel;
    }
    // Reference existing DOM nodes only
    rows.push([label, contentEl]);
  }

  // Build the block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the CMP tabs element with the new table block
  tabsRoot.replaceWith(block);
}
