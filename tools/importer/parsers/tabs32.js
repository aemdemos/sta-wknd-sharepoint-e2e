/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the CMP tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panel content in order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose table rows
  const rows = [];
  // 1. Header row with correct block name (no variant)
  rows.push(['Tabs (tabs32)']);

  // 2. Each additional row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let content = '';
    if (tabPanels[i]) {
      // Reference the main article/contentfragment inside the panel, or fallback to the panel
      // This ensures we preserve all images, headings, paragraphs, lists, etc.
      const mainFrag = tabPanels[i].querySelector('article.cmp-contentfragment') || tabPanels[i].querySelector('.contentfragment') || tabPanels[i];
      content = mainFrag;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  tabs.replaceWith(table);
}
