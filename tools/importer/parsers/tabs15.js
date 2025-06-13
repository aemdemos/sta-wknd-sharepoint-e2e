/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels from the tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li'));

  // Get all tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Safety check: skip if mismatch or nothing
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Compose header row with component name exactly as required
  const headerRow = ['Tabs (tabs15)'];

  // Each subsequent row is a tab: [Tab Label as plain text, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Get the text only, not the <li> element
    const labelText = label.textContent.trim();

    // For the content cell, reference the entire tabpanel's content for flexibility
    // If the panel has one .contentfragment article, reference that article directly; otherwise use panel's children
    let contentElem;
    const cfArticle = panel.querySelector('article');
    if (cfArticle) {
      contentElem = cfArticle;
    } else {
      // Wrap all contents in a div
      const div = document.createElement('div');
      Array.from(panel.childNodes).forEach(child => {
        if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
          div.appendChild(child);
        }
      });
      contentElem = div;
    }
    rows.push([labelText, contentElem]);
  }

  // Build the table: header, then one row per tab
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tabs section with the block table
  tabs.replaceWith(table);
}
