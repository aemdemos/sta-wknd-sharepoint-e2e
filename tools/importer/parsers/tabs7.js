/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (the div with class 'cmp-tabs')
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels in order
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map((li) => li.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the header row (block name EXACTLY as specified) -- one column only
  const rows = [['Tabs (tabs7)']];

  // Each subsequent row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i += 1) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (panel) {
      // Find a contentfragment (article) as main content, fallback to all children if not present
      let content = null;
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Fallback: reference all children nodes
        content = Array.from(panel.childNodes).filter((n) =>
          n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== '')
        );
        if (content.length === 1) {
          content = content[0];
        }
      }
      // For each tab, push a row with exactly two columns [label, content]
      rows.push([label, content]);
    }
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
