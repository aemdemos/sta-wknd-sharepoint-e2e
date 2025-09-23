/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from the tabs block
  function getTabsData(tabsBlock) {
    const tabLabels = [];
    const tabContents = [];

    // Get tab labels from <ol> list items
    const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
    if (tablist) {
      tablist.querySelectorAll('li[role="tab"]').forEach(li => {
        tabLabels.push(li.textContent.trim());
      });
    }

    // Get tab panels (content)
    const tabPanels = tabsBlock.querySelectorAll('[role="tabpanel"]');
    tabPanels.forEach(panel => {
      // Defensive: find the main contentfragment inside each panel
      let content = null;
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        // Get everything inside the contentfragment except the title
        // We'll use the .cmp-contentfragment__elements div or all children except h3
        const elements = cf.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          // If there are nested wrappers, flatten them
          // Only keep direct children that are not empty wrappers
          const contentParts = [];
          elements.childNodes.forEach(node => {
            // Filter out empty divs and grids
            if (node.nodeType === 1 && node.tagName === 'DIV') {
              // Check if this div contains actual content (like <p>, <ul>, etc)
              const meaningful = Array.from(node.childNodes).filter(
                n => n.nodeType === 1 && (n.tagName === 'P' || n.tagName === 'UL' || n.tagName === 'OL' || n.tagName === 'IMG')
              );
              if (meaningful.length) {
                contentParts.push(...meaningful);
              }
            } else if (node.nodeType === 1 && (node.tagName === 'P' || node.tagName === 'UL' || node.tagName === 'OL' || node.tagName === 'IMG')) {
              contentParts.push(node);
            }
          });
          // If nothing found, fallback to all children
          if (contentParts.length) {
            content = contentParts;
          } else {
            content = Array.from(elements.childNodes).filter(n => n.nodeType === 1);
          }
        } else {
          // Fallback: use all children except h3
          content = Array.from(cf.children).filter(child => child.tagName !== 'H3');
        }
      } else {
        // Fallback: use all children of panel
        content = Array.from(panel.children);
      }
      // Defensive: if still nothing, use panel itself
      if (!content || content.length === 0) {
        content = [panel];
      }
      tabContents.push(content);
    });

    return { tabLabels, tabContents };
  }

  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels and tab contents
  const { tabLabels, tabContents } = getTabsData(tabsBlock);

  // Build header row
  const headerRow = ['Tabs (tabs22)'];

  // Build tab rows: [label, content]
  const rows = tabLabels.map((label, i) => {
    // Defensive: tabContents[i] could be an array of elements or a single element
    let content = tabContents[i];
    if (Array.isArray(content)) {
      // Remove empty elements (e.g., empty divs)
      content = content.filter(
        el => !(el.tagName === 'DIV' && el.textContent.trim() === '')
      );
      // If only one element, use it directly
      if (content.length === 1) {
        content = content[0];
      }
    }
    return [label, content];
  });

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
