/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Header row
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Defensive: get label text
    const labelText = labelEl.textContent.trim();
    // Defensive: get panel content
    const panel = tabPanels[idx];
    // Use the entire contentfragment/article inside the panel as the content cell
    let contentCell = null;
    // Prefer the article element if present
    const article = panel.querySelector('article');
    if (article) {
      contentCell = article;
    } else {
      // Fallback: use panel itself
      contentCell = panel;
    }
    rows.push([labelText, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
