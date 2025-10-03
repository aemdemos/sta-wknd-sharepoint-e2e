/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Build header row
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: get tab label text
    const label = tabLabel.textContent.trim();

    // Defensive: get corresponding panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Tab content: grab everything inside the tabpanel
    // The tab content is a single contentfragment article
    const cf = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (cf) {
      // Use the contentfragment article directly for resilience
      tabContent = cf;
    } else {
      // Fallback: use panel content
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original tabs block with block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
