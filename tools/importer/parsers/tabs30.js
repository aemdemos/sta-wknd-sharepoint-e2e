/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all tab labels and their content
  function getTabsData(tabsEl) {
    const tabLabels = [];
    const tabContents = [];
    // Get tab labels
    const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
    if (tabList) {
      tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
        tabLabels.push(tab.textContent.trim());
      });
    }
    // Get tab panels (content)
    const tabPanels = tabsEl.querySelectorAll('.cmp-tabs__tabpanel');
    tabPanels.forEach(panel => {
      // Defensive: find the main contentfragment/article inside each tabpanel
      const cf = panel.querySelector('article.cmp-contentfragment');
      let content;
      if (cf) {
        // Use the .cmp-contentfragment__elements if present, else the whole article
        const elements = cf.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          // Remove empty grid wrappers
          const cleanElements = Array.from(elements.children).filter(child => {
            // Remove empty divs/grids
            if (child.tagName === 'DIV' && child.children.length === 1 && child.children[0].classList.contains('aem-Grid')) {
              return false;
            }
            return true;
          });
          if (cleanElements.length === 1) {
            content = cleanElements[0];
          } else {
            // Wrap multiple elements in a fragment
            content = document.createDocumentFragment();
            cleanElements.forEach(el => content.appendChild(el));
          }
        } else {
          content = cf;
        }
      } else {
        // Fallback: use the panel itself
        content = panel;
      }
      tabContents.push(content);
    });
    return { tabLabels, tabContents };
  }

  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsEl;
  if (tabsBlock) {
    tabsEl = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  } else {
    // Defensive: try to find .cmp-tabs anywhere inside
    tabsEl = element.querySelector('.cmp-tabs');
  }
  if (!tabsEl) return;

  // Get tab labels and content
  const { tabLabels, tabContents } = getTabsData(tabsEl);

  // Build table rows
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    rows.push([
      tabLabels[i],
      tabContents[i]
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
