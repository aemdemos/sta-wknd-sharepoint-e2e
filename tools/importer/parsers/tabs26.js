/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist (li elements)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find tab panels (tabpanel role)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Map tab id -> panel for easy lookup
  const panelById = {};
  tabPanels.forEach(panel => {
    const labelledby = panel.getAttribute('aria-labelledby');
    if (labelledby) panelById[labelledby] = panel;
  });

  // Compose the header row to match the example: a single cell, but spanning two columns if rendered
  // The WebImporter.DOMUtils.createTable does not support colspan, so the correct pattern is [[header], [label, content], ...]
  const headerRow = ['Tabs (tabs26)'];

  // Build tab rows: each is [tab label, tab content]
  const rows = [headerRow];
  tabItems.forEach(tab => {
    const label = tab.textContent.trim();
    const panel = panelById[tab.id];
    let contentCell = null;
    if (panel) {
      const article = panel.querySelector('article');
      if (article) {
        contentCell = article;
      } else {
        // if no article, use all child nodes except empty text nodes
        const children = Array.from(panel.childNodes).filter(node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()));
        contentCell = children.length === 1 ? children[0] : children;
      }
    } else {
      contentCell = '';
    }
    rows.push([label, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
