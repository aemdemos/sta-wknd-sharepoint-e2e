/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsEl = tabsContainer;
  if (!tabsEl) {
    tabsEl = element.querySelector('.cmp-tabs');
  }
  if (!tabsEl) return;

  // Get tab labels from tablist (typically <ol> with <li> children)
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (each tab's content)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Helper to clean up content: remove layout wrappers and keep only semantic content
  function extractTabContent(panel) {
    // If there's a contentfragment, use its children except the h3 title
    const cf = panel.querySelector('.cmp-contentfragment');
    let contentNodes = [];
    if (cf) {
      // Remove h3 title
      contentNodes = Array.from(cf.children).filter(child => {
        return !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'));
      });
      // If there's only one child and it's a wrapper, use its children
      if (contentNodes.length === 1 && contentNodes[0].children.length > 0) {
        contentNodes = Array.from(contentNodes[0].children);
      }
    } else {
      // Otherwise, use all children of the panel
      contentNodes = Array.from(panel.children);
    }
    // Remove layout wrappers (aem-Grid, etc.) and keep only semantic content
    contentNodes = contentNodes.flatMap(node => {
      if (
        node.classList &&
        (
          node.classList.contains('aem-Grid') ||
          node.classList.contains('aem-GridColumn') ||
          node.classList.contains('aem-Grid--12') ||
          node.classList.contains('aem-Grid--default--12')
        )
      ) {
        // Replace with children
        return Array.from(node.children);
      }
      return [node];
    });
    // Special handling for image caption: move the caption span below the image
    contentNodes = contentNodes.map(node => {
      if (node.classList && node.classList.contains('cmp-image')) {
        // Find caption span
        const caption = node.querySelector('.cmp-image__title');
        if (caption) {
          // Remove caption from image
          caption.remove();
          // Create a wrapper div with image and caption
          const wrapper = document.createElement('div');
          wrapper.appendChild(node);
          // Make caption uppercase to match screenshot
          const captionDiv = document.createElement('div');
          captionDiv.textContent = caption.textContent.toUpperCase();
          wrapper.appendChild(captionDiv);
          return wrapper;
        }
      }
      return node;
    });
    // Remove empty nodes and layout wrappers again
    contentNodes = contentNodes.filter(node => {
      if (node.nodeType === 3) return node.textContent.trim().length > 0; // text node
      if (node.nodeType === 1) {
        // Remove empty divs/layout wrappers
        if (
          node.tagName === 'DIV' &&
          node.children.length === 0 &&
          node.textContent.trim() === ''
        ) return false;
        if (
          node.classList && (
            node.classList.contains('aem-Grid') ||
            node.classList.contains('aem-GridColumn')
          )
        ) return false;
      }
      return true;
    });
    // If nothing left, fallback to panel itself
    if (contentNodes.length === 0) {
      contentNodes = [panel];
    }
    return contentNodes;
  }

  // Defensive: match tab labels to panels by order
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    const contentCell = extractTabContent(panel);
    rows.push([label.textContent.trim(), contentCell]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs23)'];
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabsContainer.replaceWith(table);
}
