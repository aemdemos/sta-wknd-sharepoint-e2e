/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsRoot = element.closest('.cmp-tabs') || element;
  if (!tabsRoot) return;

  // Header row as per requirements
  const headerRow = ['Tabs (tabs17)'];
  const rows = [headerRow];

  // Get tab labels (li elements in the tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure tabLabels and tabPanels match
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];

    // Defensive: skip if missing
    if (!label || !panel) continue;

    // For content, grab the direct contentfragment/article inside the panel
    // This will include all rich content, images, etc.
    let content = null;
    // Try to find the main content block inside the tab panel
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // Fallback: use the panel itself
      content = panel;
    }

    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  tabsRoot.replaceWith(table);
}
