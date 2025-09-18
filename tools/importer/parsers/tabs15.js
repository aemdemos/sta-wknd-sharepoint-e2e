/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: Find main content inside each tab panel
    // Usually a contentfragment/article
    let content = null;
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Remove repeated title if present
      const title = cf.querySelector('.cmp-contentfragment__title');
      if (title) title.remove();
      // Get the main contentfragment__elements
      const elements = cf.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        content = elements;
      } else {
        content = cf;
      }
    } else {
      // Fallback: use panel itself
      content = panel;
    }

    rows.push([label, content]);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original tabs block with new block
  tabsBlock.replaceWith(block);
}
