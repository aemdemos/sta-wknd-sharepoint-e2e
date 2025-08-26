/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (in order)
  const tabEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  const tabLabels = tabEls.map(tab => tab.textContent.trim());

  // Get tab panels (in order)
  const panelEls = Array.from(
    tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose table rows: header row is a single column, content rows are 2 columns (label, content)
  const rows = [];
  rows.push(['Tabs (tabs12)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = panelEls[i];
    if (!label || !panel) continue;

    // Find the article/contentfragment inside the panel
    let contentFragment = panel.querySelector('article');
    let contentCell = [];
    if (contentFragment) {
      // Filter out the h3.cmp-contentfragment__title
      const children = Array.from(contentFragment.children).filter(child => !child.classList.contains('cmp-contentfragment__title'));
      if (children.length === 1 && children[0].classList.contains('cmp-contentfragment__elements')) {
        // Use all children of cmp-contentfragment__elements except empty aem-Grid divs
        contentCell = Array.from(children[0].children).filter(child => {
          if (child.classList && child.classList.contains('aem-Grid')) return false;
          if (child.childNodes.length === 0 && child.textContent.trim() === '') return false;
          return true;
        });
        if (contentCell.length === 0) contentCell = [children[0]];
      } else if (children.length) {
        contentCell = children;
      } else {
        contentCell = [contentFragment];
      }
    } else {
      // fallback: all children of panel except empty aem-Grid
      const panelChildren = Array.from(panel.children).filter(child => {
        if (child.classList && child.classList.contains('aem-Grid')) return false;
        if (child.childNodes.length === 0 && child.textContent.trim() === '') return false;
        return true;
      });
      contentCell = panelChildren.length ? panelChildren : [panel];
    }
    // If there's just one node in contentCell, use it directly
    rows.push([label, contentCell.length === 1 ? contentCell[0] : contentCell]);
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
