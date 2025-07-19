/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (in order)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (in order)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Compose the header row (EXACT text as specified)
  const headerRow = ['Tabs (tabs25)'];

  // Compose the label row: use strong elements for tab names
  const labelsRow = tabLabels.map(label => {
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    return strong;
  });

  // Compose the content row: each cell is the content of the corresponding tab
  const contentsRow = tabPanels.map(panel => {
    // Prefer the .contentfragment/article, but fallback to panel's children
    const article = panel.querySelector('article');
    let nodes;
    if (article) {
      // Remove the .cmp-contentfragment__title (Riverside Camping Australia) if present
      const title = article.querySelector('.cmp-contentfragment__title');
      if (title) title.remove();
      // Retain all children (divs, paragraphs, images, etc.)
      nodes = Array.from(article.childNodes).filter(n => {
        // Exclude only the removed title node
        if (n.nodeType === 1 && n.classList && n.classList.contains('cmp-contentfragment__title')) {
          return false;
        }
        // Exclude empty text nodes
        if (n.nodeType === 3 && n.textContent.trim().length === 0) {
          return false;
        }
        return true;
      });
    } else {
      // Fallback: use all children of the panel
      nodes = Array.from(panel.childNodes).filter(n => {
        if (n.nodeType === 3 && n.textContent.trim().length === 0) {
          return false;
        }
        return true;
      });
    }
    // If only one node, return the node, else return array of nodes
    return nodes.length === 1 ? nodes[0] : nodes;
  });

  // Compose table cells: header, tab labels, tab contents
  const cells = [headerRow, labelsRow, contentsRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.parentNode.replaceChild(table, element);
}
