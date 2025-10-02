/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from the tabs block
  function getTabsData(tabsEl) {
    const tabs = [];
    // Find tab labels
    const tabLabels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li'));
    // Find tab panels (content)
    const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
    // Defensive: match labels and panels by order
    for (let i = 0; i < tabLabels.length; i++) {
      const label = tabLabels[i]?.textContent?.trim() || '';
      const panel = tabPanels[i];
      let content = [];
      if (panel) {
        // Grab the main contentfragment/article inside the panel
        const cf = panel.querySelector('article.cmp-contentfragment');
        if (cf) {
          // Get everything inside the contentfragment__elements
          const elementsWrapper = cf.querySelector('.cmp-contentfragment__elements');
          if (elementsWrapper) {
            // Instead of filtering, grab all direct children and their descendants except empty grid wrappers
            Array.from(elementsWrapper.children).forEach((child) => {
              // Skip grid wrappers only if they are truly empty
              if (child.tagName === 'DIV' && child.classList.contains('aem-Grid') && child.children.length === 0) {
                return;
              }
              // For nested divs, recursively collect all content except empty grid wrappers
              if (child.tagName === 'DIV' && child.childNodes.length > 0) {
                Array.from(child.childNodes).forEach((node) => {
                  if (node.nodeType === 1) {
                    // Skip empty grid wrappers
                    if (node.tagName === 'DIV' && node.classList.contains('aem-Grid') && node.children.length === 0) {
                      return;
                    }
                    content.push(node);
                  }
                });
              } else {
                content.push(child);
              }
            });
          } else {
            // fallback: use all children of article
            content = Array.from(cf.childNodes).filter(n => n.nodeType === 1);
          }
        } else {
          // fallback: use all children of panel
          content = Array.from(panel.childNodes).filter(n => n.nodeType === 1);
        }
      }
      // If content is still empty, fallback to all descendants except empty grid wrappers
      if (!content || content.length === 0) {
        content = Array.from(panel.querySelectorAll(':scope *')).filter(n => n.nodeType === 1 && !(n.tagName === 'DIV' && n.classList.contains('aem-Grid') && n.children.length === 0));
      }
      // Defensive: If content is still empty, fallback to panel text
      if (!content || content.length === 0) {
        content = [document.createTextNode(panel.textContent.trim())];
      }
      tabs.push([label, content]);
    }
    return tabs;
  }

  // Find the tabs block in the source HTML
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Build table rows
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];
  const tabsData = getTabsData(cmpTabs);
  tabsData.forEach(([label, content]) => {
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
