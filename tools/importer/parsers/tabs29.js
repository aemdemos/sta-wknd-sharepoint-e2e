/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Get all tab panels (tab content containers)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose the table rows
  const rows = [];
  // Header row must match the block name exactly
  rows.push(['Tabs (tabs29)']);

  // For each tab: first cell = tab label (text); second cell = tab content (reference existing element)
  tabLabels.forEach((tabLabel, i) => {
    const label = tabLabel.textContent.trim();
    let contentCell = '';
    if (tabPanels[i]) {
      // The panel might contain wrapper elements; find actual presentational content
      // Use the first .contentfragment/article, fallback to the tabPanel itself
      let mainContent = tabPanels[i].querySelector('article, .contentfragment, .cmp-contentfragment__elements');
      if (!mainContent) mainContent = tabPanels[i];

      // Remove duplicate/cosmetic title: .cmp-contentfragment__title (do not clone; reference child nodes instead)
      // We'll reference only the content nodes after cosmetic title
      let children = Array.from(mainContent.childNodes);
      // For .cmp-contentfragment, skip h3.cmp-contentfragment__title
      if (mainContent.classList && mainContent.classList.contains('cmp-contentfragment')) {
        children = children.filter(node => !(node.nodeType === 1 && node.matches('.cmp-contentfragment__title')));
      }
      // If .cmp-contentfragment__elements, do same
      if (mainContent.classList && mainContent.classList.contains('cmp-contentfragment__elements')) {
        children = children.filter(node => !(node.nodeType === 1 && node.matches('.cmp-contentfragment__title')));
      }
      // Remove empty text nodes
      children = children.filter(node => {
        if (node.nodeType === 3) return node.textContent.trim() !== '';
        return true;
      });
      // Place all presentational children in the cell (so we reference existing elements)
      contentCell = children.length === 1 ? children[0] : children;
    }
    rows.push([label, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(block);
}
