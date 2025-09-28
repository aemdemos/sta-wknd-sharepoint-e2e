/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row: must use block name exactly
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: Find the contentfragment inside the tabpanel
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Reference the contentfragment element directly
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    }
    rows.push([labelText, tabContent]);
  }

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
