/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from the cmp-tabs block
  function getTabsData(tabsEl) {
    const tabLabels = [];
    const tabContents = [];
    // Get tab labels from <ol role="tablist"> > <li>
    const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
    if (tabList) {
      tabList.querySelectorAll('li[role="tab"]').forEach(li => {
        tabLabels.push(li.textContent.trim());
      });
    }
    // Get tab content panels
    const tabPanels = tabsEl.querySelectorAll('.cmp-tabs__tabpanel');
    tabPanels.forEach(panel => {
      // Defensive: find the contentfragment article inside
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        // For tab content, grab everything inside the contentfragment's elements container
        const elementsContainer = cf.querySelector('.cmp-contentfragment__elements');
        if (elementsContainer) {
          // Gather all direct children except empty grid wrappers
          const contentNodes = [];
          elementsContainer.childNodes.forEach(node => {
            // Filter out empty grid wrappers
            if (node.nodeType === 1) {
              // If it's a div with aem-Grid, skip if empty
              if (node.classList.contains('aem-Grid') && !node.textContent.trim()) return;
              // If it's a div with only aem-Grid inside, skip
              if (
                node.classList.contains('aem-Grid') &&
                node.children.length === 1 &&
                node.children[0].classList.contains('aem-Grid') &&
                !node.children[0].textContent.trim()
              ) return;
              // Otherwise, include
              contentNodes.push(node);
            } else if (node.nodeType === 3) {
              // Text node
              if (node.textContent.trim()) {
                contentNodes.push(document.createTextNode(node.textContent));
              }
            }
          });
          // If nothing, fallback to panel
          tabContents.push(contentNodes.length ? contentNodes : [elementsContainer]);
        } else {
          tabContents.push([cf]);
        }
      } else {
        tabContents.push([panel]);
      }
    });
    return { tabLabels, tabContents };
  }

  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;
  const { tabLabels, tabContents } = getTabsData(tabsBlock);

  // Compose table rows: header, then each tab label + content
  const headerRow = ['Tabs (tabs21)'];
  const tableRows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    tableRows.push([
      tabLabels[i],
      tabContents[i]
    ]);
  }

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
