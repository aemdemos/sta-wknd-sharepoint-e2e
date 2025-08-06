/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels in order from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map((el) => el.textContent.trim());

  // Extract tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build a 2D array for the block table
  const cells = [];
  cells.push(['Tabs (tabs29)']); // Header row as required

  // For each tab, extract its label and its panel content as a cell
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    let contentCell;
    if (panel) {
      // Prefer to include the article node representing the tab's content fragment
      const article = panel.querySelector('article.cmp-contentfragment');
      if (article) {
        contentCell = article;
      } else {
        // Fallback: include all children nodes of the panel
        contentCell = Array.from(panel.childNodes).filter(node => {
          // Filter out script/style/empty text/etc.
          if (node.nodeType === 1) return true;
          if (node.nodeType === 3 && node.textContent.trim()) return true;
          return false;
        });
      }
    } else {
      // If there's no panel, leave content cell empty
      contentCell = '';
    }
    cells.push([label, contentCell]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.parentNode.replaceChild(block, element);
}
