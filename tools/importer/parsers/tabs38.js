/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels (order matters)
  const tabLabelEls = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Extract all tab panels (order matters)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows
  // First row: block name
  const rows = [['Tabs (tabs38)']];

  // For each tab, add [label, content] row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Use the *entire* panel's content – reference, do not clone
      // Look for '.contentfragment > article', else fallback to first child
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        const article = contentFragment.querySelector('article');
        if (article) {
          content = article;
        } else {
          content = contentFragment;
        }
      } else {
        // If no contentfragment, reference the panel itself
        content = panel;
      }
    } else {
      // No panel found, insert empty string for content
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the block table and replace the tabs element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
