/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsWrapper = element.querySelector('.cmp-tabs');
  if (!tabsWrapper) return;

  // Get tab labels
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));

  // The header row for the block EXACTLY as required
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];

  // For each tab, extract label and corresponding content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const ariaControls = tabLabels[i].getAttribute('aria-controls');
    let panel = tabPanels.find(panelEl => panelEl.id === ariaControls);
    if (!panel && tabPanels[i]) {
      panel = tabPanels[i];
    }
    // Extract content from the panel (skip the panel wrapper, use its content children)
    let contentEl = null;
    if (panel) {
      // Some tabpanel children may be empty grid wrappers, filter them out
      // Use all non-empty children, but if only one, just use that element
      const goodChildren = Array.from(panel.children).filter(child => {
        // Remove empty grid wrappers and empty divs
        if (child.classList.contains('aem-Grid')) return false;
        if (child.classList.contains('aem-GridColumn')) return false;
        if (child.tagName === 'DIV' && child.innerHTML.trim() === '') return false;
        return true;
      });
      // If only one good child, use it; if several, use them all
      contentEl = goodChildren.length === 1 ? goodChildren[0] : goodChildren;
      // If none, leave as null
    }
    rows.push([label, contentEl]);
  }

  // Create the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
