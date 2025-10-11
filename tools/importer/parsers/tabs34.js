/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer ? tabsContainer.querySelector('.cmp-tabs') : null;
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only continue if labels and panels match
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];

  // Build rows for each tab
  tabLabels.forEach((tabLabel, i) => {
    // Tab name
    const tabName = tabLabel.textContent.trim();
    // Tab content panel
    const panel = tabPanels[i];
    // Defensive: If panel not found, skip
    if (!panel) return;

    // For robustness: extract all direct children of the tab panel's contentfragment/article
    let tabContent = [];
    // Find contentfragment/article inside panel
    const article = panel.querySelector('article');
    if (article) {
      // If there's an image, include it
      const image = article.querySelector('img');
      if (image) {
        tabContent.push(image);
        // If there's a caption
        const caption = image.parentElement.querySelector('.cmp-image__title');
        if (caption) tabContent.push(caption);
      }
      // Find main content elements (paragraphs, lists, etc)
      // We'll include all direct children of .cmp-contentfragment__elements
      const elementsContainer = article.querySelector('.cmp-contentfragment__elements');
      if (elementsContainer) {
        // Only include non-empty elements
        Array.from(elementsContainer.children).forEach((child) => {
          // Defensive: skip empty grid wrappers
          if (child.children.length === 0 && child.textContent.trim() === '') return;
          // For lists, paragraphs, etc
          if (child.tagName === 'DIV') {
            Array.from(child.children).forEach((grandchild) => {
              if (grandchild.tagName === 'UL' || grandchild.tagName === 'P' || grandchild.tagName === 'H2') {
                tabContent.push(grandchild);
              }
            });
          } else if (child.tagName === 'UL' || child.tagName === 'P' || child.tagName === 'H2') {
            tabContent.push(child);
          }
        });
      }
      // If still empty, fallback to all direct children of article
      if (tabContent.length === 0) {
        Array.from(article.children).forEach((child) => {
          if (child.tagName !== 'H3') tabContent.push(child);
        });
      }
    } else {
      // If no article, fallback to all direct children of panel
      Array.from(panel.children).forEach((child) => {
        tabContent.push(child);
      });
    }
    // Defensive: If tabContent is empty, fallback to panel text
    if (tabContent.length === 0) {
      tabContent.push(document.createTextNode(panel.textContent.trim()));
    }
    rows.push([tabName, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
