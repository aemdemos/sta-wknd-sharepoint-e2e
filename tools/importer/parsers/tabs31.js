/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels from the tablist
  const tabList = tabsRoot.querySelector('[role="tablist"]');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tabEl => {
      tabLabels.push(tabEl.textContent.trim());
    });
  }

  // Get all tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Prepare the table header and rows
  const headerRow = ['Tabs (tabs31)'];
  const cells = [headerRow];

  // For each tab, get the label and main content
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Find the content element inside the tabpanel. For this HTML, it's article.cmp-contentfragment
    let tabContent = null;
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      tabContent = article;
    } else {
      // fallback to entire panel content
      tabContent = panel;
    }
    cells.push([label, tabContent]);
  }

  // Create the table and replace the original tabs element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(table);
}
