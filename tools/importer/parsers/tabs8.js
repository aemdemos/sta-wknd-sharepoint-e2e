/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs block (Tabs component)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels (li elements inside .cmp-tabs__tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find tab panels (.cmp-tabs__tabpanel) in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the header row - use the exact block name
  const rows = [['Tabs (tabs8)']];

  // Process each tab: label and its content
  for (let i = 0; i < tabLabels.length; i++) {
    // Get the tab label text
    const label = tabLabels[i] ? tabLabels[i].textContent.trim() : '';
    // Extract relevant tab panel content
    let panelContent = null;
    if (tabPanels[i]) {
      // Prefer referencing the main content fragment for each tab
      // Find the article inside the tab panel
      const article = tabPanels[i].querySelector('article');
      if (article) {
        // Usually the article contains .cmp-contentfragment__elements
        const fragmentElements = article.querySelector('.cmp-contentfragment__elements');
        if (fragmentElements) {
          // Use the .cmp-contentfragment__elements (contains all relevant tab content)
          panelContent = fragmentElements;
        } else {
          // If not available, use the article itself
          panelContent = article;
        }
      } else {
        // If no article, fallback to the entire tabPanel
        panelContent = tabPanels[i];
      }
    }
    rows.push([label, panelContent]);
  }

  // Build and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
