/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block (the tab container)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tab list
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get all tab panels in DOM order
  // These usually match label order in AEM but double-check for safety
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Prepare the table header row per requirements
  const headerRow = ['Tabs (tabs28)'];

  // Prepare an array to collect each tab's row: [label, content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Try to reference any contentfragment > article inside the panel for the main content
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      // Remove .cmp-contentfragment__title (duplicate tab title)
      const title = article.querySelector('.cmp-contentfragment__title');
      if (title) title.remove();
      // Remove empty .aem-Grid wrappers and empty divs
      Array.from(article.querySelectorAll('.aem-Grid')).forEach(grid => grid.remove());
      Array.from(article.querySelectorAll('div')).forEach(div => {
        if (!div.textContent.trim() && div.children.length === 0) div.remove();
      });
      // Collect all children (elements and non-empty text nodes)
      const contentNodes = Array.from(article.childNodes).filter(
        n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
      );
      tabContent = contentNodes;
    } else {
      // Fallback to all direct children of panel
      const contentNodes = Array.from(panel.childNodes).filter(
        n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
      );
      tabContent = contentNodes;
    }
    // Add label and tabContent (as array) to the rows
    rows.push([label, tabContent]);
  }

  // Build the 2D table array for createTable
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block element in the DOM
  tabsBlock.replaceWith(table);
}
