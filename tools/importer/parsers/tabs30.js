/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (should be <li> elements)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabButtons = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Gather all tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose header row exactly as example specifies
  const headerRow = ['Tabs (tabs30)'];
  const cells = [headerRow];

  // For each tab, extract the label and corresponding content
  tabButtons.forEach((tabBtn) => {
    const label = tabBtn.textContent.trim();
    // Find corresponding panel by aria-controls attribute
    const controlsId = tabBtn.getAttribute('aria-controls');
    const panel = controlsId ? tabs.querySelector(`#${controlsId}`) : null;
    if (!panel) return; // Skip if panel missing

    // Get the tab content: pick the contentfragment's elements block if present, else use the panel itself
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      const fragElements = article.querySelector('.cmp-contentfragment__elements');
      if (fragElements && fragElements.children.length > 0) {
        tabContent = fragElements;
      } else {
        tabContent = article;
      }
    } else {
      tabContent = panel;
    }

    // Push this tab's row ([label, tabContent])
    cells.push([label, tabContent]);
  });

  // Only create the block if we have at least one tab row
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
