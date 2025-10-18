/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels from tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: If tab count doesn't match panel count, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;

    // Find the main contentfragment/article inside each panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }

    // Ensure all text, images, and semantic HTML are preserved
    // Reference existing elements, do not clone
    rows.push([
      label,
      tabContent
    ]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(blockTable);
}
