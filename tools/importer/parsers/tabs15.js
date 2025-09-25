/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements inside ol.cmp-tabs__tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: skip if no panel
    if (!panel) continue;

    // For content: grab the contentfragment/article inside the tabpanel
    // We'll use the entire article as the content cell for resilience
    const article = panel.querySelector('article');
    let contentCell;
    if (article) {
      contentCell = article;
    } else {
      // fallback: use all children of the panel
      contentCell = Array.from(panel.childNodes);
    }
    rows.push([label, contentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
