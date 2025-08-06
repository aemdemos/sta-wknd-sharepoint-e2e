/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab list and labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []).map(li => li.textContent.trim()).filter(Boolean);

  // Find all tabpanels (order may not be guaranteed by DOM, so use aria-labelledby)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare rows for the table: header first, then each tab (label, content)
  const rows = [];
  rows.push(['Tabs (tabs30)']); // The block/table header, exactly as required

  // For each tab label, find the corresponding content panel
  tabLabels.forEach((label) => {
    // Find the <li> for this label, and get its id
    let tabLi = Array.from(tabList.children).find(li => li.textContent.trim() === label);
    let tabId = tabLi ? tabLi.getAttribute('id') : null;
    let panel = tabId ? tabPanels.find(tp => tp.getAttribute('aria-labelledby') === tabId) : null;
    // Fallback if no panel by id: try matching by text index
    if (!panel) {
      const idx = tabLabels.indexOf(label);
      panel = tabPanels[idx];
    }
    // Defensive: if still missing, skip
    if (!panel) return;

    // For tab content, reference the main content node under the panel
    // Prefer .contentfragment, else article, else take panel's firstElementChild, else panel
    let tabContent = panel.querySelector('.contentfragment, article');
    if (!tabContent) {
      // fallback: skip empty .aem-Grid if it's the first child
      let fc = panel.firstElementChild;
      if (
        fc &&
        fc.classList.contains('aem-Grid') &&
        fc.children.length === 0 &&
        panel.children.length > 1
      ) {
        tabContent = panel.children[1];
      } else if (fc) {
        tabContent = fc;
      } else {
        tabContent = panel;
      }
    }
    // Add row: [tab label, tab content node]
    rows.push([label, tabContent]);
  });

  // Build the table block using the table helper
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(block);
}
