/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the actual tabs block.
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels (the tab headers in the UI)
  const tabLabelElements = tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelElements).map(tab => tab.textContent.trim());

  // Extract the content panels (one per tab)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build table header exactly as specified
  const cells = [['Tabs (tabs12)']];

  // For each tab, extract content and add a row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main content fragment under this panel
    let tabContentElements = [];
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Try to get main .cmp-contentfragment__elements container
      const cfElements = cf.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Collect only meaningful children (skip empty wrappers or grids)
        const meaningful = Array.from(cfElements.children).filter(child => {
          // Remove empty grid wrappers
          if (child.classList.contains('aem-Grid')) return false;
          // Remove divs whose only child is a grid
          if (
            child.tagName === 'DIV' &&
            child.children.length === 1 &&
            child.firstElementChild.classList.contains('aem-Grid')
          ) {
            return false;
          }
          // Remove divs with only whitespace or emptiness
          if (
            child.tagName === 'DIV' &&
            child.textContent.trim() === '' &&
            child.children.length === 0
          ) {
            return false;
          }
          return true;
        });
        if (meaningful.length > 0) {
          tabContentElements = meaningful;
        } else {
          // fallback to the whole cf if nothing meaningful found
          tabContentElements = [cf];
        }
      } else {
        tabContentElements = [cf];
      }
    } else {
      // fallback, reference all children of the panel
      tabContentElements = Array.from(panel.children);
    }

    cells.push([label, tabContentElements]);
  }

  // Create and replace with the tabs block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
