/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (this is the tabbed content block)
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract all tab labels (li elements with role="tab")
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];

  // Extract all tabpanels (divs with role="tabpanel") in correct order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Create the table header row exactly as required
  const headerRow = ['Tabs (tabs36)'];

  // Compose the rows: each tab label and its content
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find corresponding panel (by index)
    const panel = tabPanels[i];
    if (!panel) continue;
    // Content: reference the main contentfragment/article inside the panel, otherwise the panel itself
    let contentEl = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (!contentEl) contentEl = panel;
    rows.push([label, contentEl]);
  }

  // Create block table using referenced elements
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
