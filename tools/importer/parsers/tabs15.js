/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the main tab container)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (as text)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map((li) => li.textContent.trim());

  // Get all tab panel elements (each tab's content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the header row (exactly as in the example)
  const rows = [
    ['Tabs (tabs15)']
  ];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    // Defensive: If the panel is missing, just leave cell blank
    if (!panel) {
      rows.push([label, '']);
      return;
    }
    // Find the main content for the tab -- if there is an article, use that, else use the tabpanel's content
    let panelContent;
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      panelContent = article;
    } else if (panel.children.length === 1) {
      panelContent = panel.firstElementChild;
    } else {
      // If there are multiple nodes, wrap them in a div
      const container = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => container.appendChild(node));
      panelContent = container;
    }
    rows.push([label, panelContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original .cmp-tabs element with the block table
  tabsRoot.replaceWith(table);
}
