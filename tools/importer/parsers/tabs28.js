/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabHeaders = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );
  // Get tab panels
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have matching headers and panels
  if (!tabHeaders.length || !tabPanels.length || tabHeaders.length !== tabPanels.length) return;

  // Table header row (CRITICAL: must match block name exactly)
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  tabHeaders.forEach((tabHeader, i) => {
    // Tab label
    const label = tabHeader.textContent.trim();
    // Tab content
    const panel = tabPanels[i];
    if (!panel) return;

    // Extract all direct children of the panel (preserve semantic HTML)
    // If there's a contentfragment/article, use that
    let tabContent;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Otherwise, use all element children
      const fragment = document.createElement('div');
      Array.from(panel.children).forEach(child => {
        fragment.appendChild(child);
      });
      tabContent = fragment;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.replaceWith(block);
}
