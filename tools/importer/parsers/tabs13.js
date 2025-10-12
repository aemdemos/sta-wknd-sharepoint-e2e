/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements inside tablist)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: match labels to panels by order
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Find the contentfragment/article inside the panel
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        // Remove the contentfragment title (h3) if present
        const cfTitle = cf.querySelector('.cmp-contentfragment__title');
        if (cfTitle) cfTitle.remove();
        // Use the rest of the article as content
        content = Array.from(cf.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      } else {
        // fallback: use all children of panel
        content = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      }
    }
    // Defensive: if no content, use empty string
    rows.push([
      label,
      content && content.length === 1 ? content[0] : (content && content.length ? content : '')
    ]);
  }

  // Header row
  const headerRow = ['Tabs (tabs13)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace original tabs element with the table
  tabs.replaceWith(table);
}
