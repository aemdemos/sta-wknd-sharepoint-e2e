/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs inside
  const tabsComp = tabsRoot.querySelector('.cmp-tabs');
  if (!tabsComp) return;

  // Get tab labels from the tablist
  const tabList = tabsComp.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabEls = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  const tabLabels = tabEls.map(li => li.textContent.trim());

  // Get tab panels in order
  const panelEls = Array.from(
    tabsComp.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Compose the block table
  const cells = [];
  cells.push(['Tabs (tabs37)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = panelEls[i];
    let content = '';
    if (panel) {
      // Try to find the main article/contentfragment inside the panel
      // This will include all the textual and media content for the tab
      // Reference the article directly if present
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Fallback to panel's content
        // Remove any empty div.aem-Grid structure inside
        // We'll aggregate all non-empty direct children
        const children = Array.from(panel.children).filter(child => {
          // Filter out empty or decorative aem-Grid wrappers
          if (child.matches('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12')) return false;
          if (child.textContent.trim() === '' && child.children.length === 0) return false;
          return true;
        });
        if (children.length === 1) {
          content = children[0];
        } else if (children.length > 1) {
          content = children;
        } else {
          content = panel;
        }
      }
    }
    cells.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabsRoot.replaceWith(table);
}
