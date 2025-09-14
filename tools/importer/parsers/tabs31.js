/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header row as required
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Find the main contentfragment/article inside the panel
      const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // Fallback: use all children of panel
        content = Array.from(panel.childNodes);
      }
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
