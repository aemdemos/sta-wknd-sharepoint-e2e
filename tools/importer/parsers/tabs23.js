/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Defensive: Get label text
    const labelText = labelEl.textContent.trim();

    // Defensive: Get panel content
    const panel = tabPanels[i];
    let contentBlock = null;
    if (panel) {
      // Use the entire contentfragment/article inside the panel as the content
      // Usually there's a single .contentfragment > article
      const cf = panel.querySelector('.contentfragment');
      if (cf) {
        // Prefer the article inside
        const article = cf.querySelector('article');
        contentBlock = article || cf;
      } else {
        // Fallback: use panel itself
        contentBlock = panel;
      }
    }
    rows.push([labelText, contentBlock]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block
  tabsRoot.replaceWith(block);
}
