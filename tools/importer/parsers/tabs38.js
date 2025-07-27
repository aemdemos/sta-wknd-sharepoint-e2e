/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block as defined by the cmp-tabs class
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // 1. Extract tab labels in order
  const tabLabelEls = tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelEls).map(el => el.textContent.trim());

  // 2. Extract tab panels in order
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // 3. Pair up tab labels and panels, referencing the panel's actual content fragment/article if present
  const rows = tabLabels.map((label, idx) => {
    let panel = tabPanels[idx];
    if (!panel) return [label, '']; // Defensive, should not happen unless mismatch
    // Try to find the main .contentfragment > article (most content is in there)
    let contentToUse = null;
    const article = panel.querySelector('article');
    if (article) {
      contentToUse = article;
    } else {
      // If nothing else, put the whole panel
      contentToUse = panel;
    }
    return [label, contentToUse];
  });

  // 4. Compose cells for the block table
  const cells = [
    ['Tabs (tabs38)'], // Header row, exactly as required
    ...rows
  ];

  // 5. Create the table using the WebImporter helper
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the new block table
  element.replaceWith(table);
}
