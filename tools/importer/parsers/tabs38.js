/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the <li>s in the tablist
  const tabLabelEls = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get tab panel elements, which correspond to the tab labels
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare the block table: header row first
  const cells = [
    ['Tabs (tabs38)'],
  ];

  // For each tab, create a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Try to reference the main content within the tab:
    // - For these tabs, content is mostly inside an article.cmp-contentfragment (with nested elements),
    // - Some content (like images, lists) is already there and should be referenced as is.
    // Reference the first 'article.cmp-contentfragment', or fallback to the panel itself
    let tabContent;
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      tabContent = article;
    } else {
      // fallback: use the panel itself if for some reason no article present
      tabContent = panel;
    }
    cells.push([
      label,
      tabContent,
    ]);
  }

  // Create the table using referenced elements
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the block table
  tabsRoot.replaceWith(table);
}
