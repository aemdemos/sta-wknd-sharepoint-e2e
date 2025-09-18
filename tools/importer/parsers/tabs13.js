/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root
  const tabsRoot = element.closest('.cmp-tabs') || element;

  // Header row as specified
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure tabPanels and tabLabels match
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Find the main content fragment/article inside each tab panel
    let content = null;
    content = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    // Reference the existing element, do not clone
    rows.push([label, content]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
