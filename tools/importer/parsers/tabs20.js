/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs container within element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels in order from tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: use as many panels as there are labels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Compose rows: header row first (block name as specified), then each tab label/content
  const rows = [['Tabs (tabs20)']];

  for (let i = 0; i < numTabs; i++) {
    // Tab label as first cell
    const label = tabLabels[i].textContent.trim();

    // Tab content is everything inside the tabpanel
    const tabPanel = tabPanels[i];
    // We'll gather all children (including contentfragment, images, etc) into a <div>
    const contentDiv = document.createElement('div');
    // Add all child nodes from tabPanel into contentDiv (reference, don't clone)
    Array.from(tabPanel.childNodes).forEach(node => {
      // Ignore empty text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      // If the node is a .contentfragment with a single <article>, unwrap the article
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains('contentfragment') &&
        node.children.length === 1 &&
        node.children[0].tagName === 'ARTICLE'
      ) {
        // Move all children of the article into contentDiv
        const article = node.children[0];
        Array.from(article.childNodes).forEach(articleChild => {
          contentDiv.appendChild(articleChild);
        });
      } else {
        contentDiv.appendChild(node);
      }
    });
    // Add the row: [Tab Label, Tab Content]
    rows.push([label, contentDiv]);
  }

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
