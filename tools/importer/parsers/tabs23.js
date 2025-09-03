/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Build the header row as required
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, pair label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find the corresponding tab panel
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Grab the main contentfragment inside the panel
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        // Find the elements container
        const elementsContainer = cf.querySelector('.cmp-contentfragment__elements');
        if (elementsContainer) {
          // Filter out empty grid wrappers and empty divs
          const contentNodes = Array.from(elementsContainer.childNodes).filter((node) => {
            if (node.nodeType === 1 && node.classList.contains('aem-Grid')) return false;
            if (node.nodeType === 1 && node.tagName === 'DIV' && node.innerHTML.trim() === '') return false;
            return true;
          });
          // If there's only one node and it's a wrapper div, unwrap its children
          if (contentNodes.length === 1 && contentNodes[0].nodeType === 1 && contentNodes[0].tagName === 'DIV') {
            content = Array.from(contentNodes[0].childNodes).filter((node) => {
              if (node.nodeType === 1 && node.classList.contains('aem-Grid')) return false;
              if (node.nodeType === 1 && node.tagName === 'DIV' && node.innerHTML.trim() === '') return false;
              return true;
            });
          } else {
            content = contentNodes;
          }
        } else {
          // Fallback: use all children except the title
          const cfTitle = cf.querySelector('.cmp-contentfragment__title');
          content = Array.from(cf.childNodes).filter((node) => node !== cfTitle);
        }
      } else {
        // Fallback: use panel's children
        content = Array.from(panel.childNodes);
      }
    }
    // Defensive: If content is empty, use an empty string
    if (!content || (Array.isArray(content) && content.length === 0)) {
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block element
  tabsBlock.replaceWith(block);
}
