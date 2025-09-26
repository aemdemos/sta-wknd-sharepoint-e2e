/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tab structure)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get all tab labels (li elements in the tablist)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist li, [role="tablist"] li')
  );

  // Get all tab panels (divs with cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: If tab count doesn't match panel count, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Header row as required
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: If no panel, skip
    if (!panel) continue;

    // Find the actual content fragment/article inside the tabpanel
    let content = null;
    // Try to find the main content fragment/article
    const article = panel.querySelector('article');
    if (article) {
      // Remove the title (h3) if present, as it's just the adventure name
      const h3 = article.querySelector('h3');
      if (h3) h3.remove();
      // The rest of the article is the tab content
      // Use the .cmp-contentfragment__elements or just the article's children
      const elements = article.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Remove empty grid wrappers
        elements.querySelectorAll('.aem-Grid').forEach(e => e.remove());
        // If only one child, use it directly, else use all children
        if (elements.children.length === 1) {
          content = elements.firstElementChild;
        } else {
          content = Array.from(elements.children);
        }
      } else {
        // fallback: use all children except h3
        content = Array.from(article.children);
      }
    } else {
      // fallback: use all children of panel
      content = Array.from(panel.children);
    }

    // Clean up: remove empty grid wrappers from content if it's an array
    if (Array.isArray(content)) {
      content = content.filter(el => {
        if (el.classList && el.classList.contains('aem-Grid')) return false;
        return true;
      });
      // If only one element, use it directly
      if (content.length === 1) content = content[0];
    }

    // Add the row: [tab label, tab content]
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
