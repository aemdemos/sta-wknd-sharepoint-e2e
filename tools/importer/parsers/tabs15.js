/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: match labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build rows: first row is always block name
  const rows = [
    ['Tabs (tabs15)']
  ];

  for (let i = 0; i < numTabs; i += 1) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: clone the panel's content to avoid moving it in DOM
    let tabContent;
    // Try to find the content fragment/article inside the panel
    const article = panel.querySelector('article');
    if (article) {
      // Remove the repeated title if present
      const title = article.querySelector('.cmp-contentfragment__title');
      if (title) title.remove();
      tabContent = document.createElement('div');
      // Append all children of article except the title
      Array.from(article.childNodes).forEach(node => {
        tabContent.appendChild(node.cloneNode(true));
      });
    } else {
      // Fallback: use the panel's inner content
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }
    rows.push([
      label,
      tabContent
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs container with the table
  tabsContainer.replaceWith(table);
}
