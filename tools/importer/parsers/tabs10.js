/* global WebImporter */
export default function parse(element, { document }) {
  // Find the correct tabs block within the given element
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  const tabsContainer = tabsBlock.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Extract tab content panels (order should match tabLabels)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row (block name matches example exactly; single cell)
  const headerRow = ['Tabs (tabs10)'];

  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label text
    const label = tabLabels[i]?.textContent.trim() || '';

    // Tab content: use the article from the tabpanel if present, else all children
    let contentCell = '';
    const panel = tabPanels[i];
    if (panel) {
      // Reference the article (not clone) if present
      const article = panel.querySelector('article');
      if (article) {
        contentCell = article;
      } else if (panel.children.length > 0) {
        // Reference all children as an array for robustness
        contentCell = Array.from(panel.children);
      } else {
        // fallback to textContent (should rarely occur)
        contentCell = panel.textContent || '';
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the table (header is 1 column, following rows are 2 columns)
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
