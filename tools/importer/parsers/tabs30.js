/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Find the main tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Prepare table rows
  const rows = [];
  // Header row as per requirements
  rows.push(['Tabs (tabs30)']);

  // For each tab, find its label and content
  tabLabels.forEach((tabLabel, idx) => {
    // Defensive: match tab label to tabpanel by aria-controls/id
    const ariaControls = tabLabel.getAttribute('aria-controls');
    let panel = tabPanels.find(tp => tp.id === ariaControls);
    if (!panel) {
      // fallback: try by order
      panel = tabPanels[idx];
    }
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: find the main content fragment/article inside the panel
    // We'll use the entire contentfragment/article as the content cell
    let content = panel.querySelector('article') || panel;

    rows.push([labelText, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
