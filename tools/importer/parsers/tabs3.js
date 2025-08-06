/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (variant: tabs3)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim());

  // Get all tabpanels (one per tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  // Defensive: if number of panels not matching labels, abort
  if (tabPanels.length !== tabLabels.length) return;

  // For each tab panel, extract the *existing* main content for the cell
  // We'll prefer to use the main <article> inside each tabpanel, otherwise take all children
  const tabContentElements = tabPanels.map(tabpanel => {
    // Try to reference the main article (if present)
    const article = tabpanel.querySelector('article');
    if (article) {
      return article;
    }
    // Otherwise, if there is a single main div/content fragment
    const contentDiv = tabpanel.querySelector('.contentfragment, .cmp-contentfragment__elements, div');
    if (contentDiv) {
      return contentDiv;
    }
    // Fallback: reference all child nodes (as an array of elements)
    const contentNodes = Array.from(tabpanel.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
    if (contentNodes.length) {
      return contentNodes;
    }
    // If nothing found, make an empty <div>
    return document.createElement('div');
  });

  // Compose the table: first row is block name (per spec), then every tab [label, content]
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    rows.push([tabLabels[i], tabContentElements[i]]);
  }

  // Create the tabs block table and replace the original tabs block element
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(blockTable);
}
