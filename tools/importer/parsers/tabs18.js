/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block in the source element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelNodes = tablist ? Array.from(tablist.querySelectorAll('li')) : [];
  const tabLabels = tabLabelNodes.map(li => li.textContent.trim());

  // Get all tabpanels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row must match the required format
  const headerRow = ['Tabs (tabs18)'];
  const cells = [headerRow];

  // For each tab, gather label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Try to get the corresponding panel; if missing, skip
    const panel = tabPanels[i];
    let contentNode;
    if (panel) {
      // Reference the article/contentfragment as the main tab content if present
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        contentNode = cf;
      } else {
        // If not, use the panel's first element child
        contentNode = panel.firstElementChild || document.createDocumentFragment();
      }
    } else {
      // If no panel for this label, use an empty fragment
      contentNode = document.createDocumentFragment();
    }
    cells.push([label, contentNode]);
  }

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace only the tabs block, not the entire element (preserves sidebar/other content)
  tabsBlock.replaceWith(table);
}
