/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements inside .cmp-tabs__tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Get all tab contents (each .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row: Single cell as per requirements
  const headerRow = ['Tabs (tabs25)'];

  // Build table rows: each [label, content fragment]
  const rows = [headerRow];

  tabPanels.forEach((panel, i) => {
    // Find the corresponding label by aria-labelledby or fallback to order
    let label = '';
    if (panel.hasAttribute('aria-labelledby')) {
      const tabId = panel.getAttribute('aria-labelledby');
      const labelElem = tabId ? tabsBlock.querySelector(`#${tabId}`) : null;
      if (labelElem) {
        label = labelElem.textContent.trim();
      }
    }
    if (!label && tabLabels[i]) {
      label = tabLabels[i].textContent.trim();
    }
    // Get the main content of the tab (typically the contentfragment)
    let contentElem = null;
    // Prefer the first .contentfragment inside the panel
    contentElem = panel.querySelector('.contentfragment');
    // If not found, fallback to first non-empty element child (excluding empty .aem-Grid)
    if (!contentElem) {
      const possibles = Array.from(panel.children).filter(child => {
        if (child.classList && child.classList.contains('aem-Grid')) {
          return child.textContent.trim().length > 0;
        }
        return true;
      });
      if (possibles.length > 0) {
        contentElem = possibles[0];
      } else {
        // fallback: use panel itself if nothing else
        contentElem = panel;
      }
    }
    rows.push([label, contentElem]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
