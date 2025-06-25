/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs container inside the '.tabs' block
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Extract tab labels
  const tabLabels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract tab panels
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Set the block header as in the example
  const rows = [['Tabs (tabs14)']];

  // For each tab, add a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Find the most meaningful content inside the tab panel
    // Prefer the cmp-contentfragment article, else fallback to all children
    let tabContent = null;
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      tabContent = article;
    } else {
      // As a fallback, group all children of the panel (excluding empty grid wrappers)
      const children = Array.from(panel.children).filter(child => {
        // remove empty div aem-Grid wrappers
        if (child.classList && child.classList.contains('aem-Grid')) return false;
        return true;
      });
      if (children.length === 1) {
        tabContent = children[0];
      } else {
        // combine all children
        tabContent = children;
      }
    }
    rows.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
