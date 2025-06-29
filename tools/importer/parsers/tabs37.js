/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tablist (labels)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li.cmp-tabs__tab') : []);

  // Find the tabpanels (content for each tab)
  // Only consider direct children that are panels (avoid nested ones in reused markup)
  const allTabPanels = Array.from(
    tabsBlock.querySelectorAll(':scope > [role="tabpanel"]')
  );

  // If not direct children, fallback to all tabpanels inside this block
  const tabPanels = allTabPanels.length
    ? allTabPanels
    : Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Compose header row
  const headerRow = ['Tabs (tabs37)'];
  // Compose a row for labels (as <strong> elements)
  const labelRow = tabLabels.map(label => {
    // Retain semantic bold for tab labels as in UI
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    return strong;
  });
  // Compose a row for tab contents, referencing existing nodes
  const contentRow = tabPanels.map(panel => {
    // Try to find <article> or similar, otherwise use the panel itself
    let mainContent = null;
    // Prefer .contentfragment > article, else .contentfragment, else panel
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      const article = contentFragment.querySelector('article');
      if (article) {
        mainContent = article;
      } else {
        mainContent = contentFragment;
      }
    } else {
      mainContent = panel;
    }
    return mainContent;
  });

  // Only build table if we have at least one tab/label/content
  if (labelRow.length && contentRow.length && labelRow.length === contentRow.length) {
    const cells = [
      headerRow,
      labelRow,
      contentRow,
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    tabsBlock.replaceWith(table);
  }
}
