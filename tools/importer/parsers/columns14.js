/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !document) return;

  // Find the main grid inside the container
  const mainGrid = element.querySelector('.cmp-container > .aem-Grid');
  if (!mainGrid) return;

  // Find the 3-column grid (the left sidebar and right content)
  const columnsGrid = mainGrid.querySelector('.cmp-container > .aem-Grid');
  const columns = columnsGrid ? Array.from(columnsGrid.children) : [];

  // LEFT COLUMN: Sidebar (activity, type, length, size, difficulty, price, share)
  let leftCol = null;
  if (columns.length > 0) {
    leftCol = columns[0].querySelector('article.cmp-contentfragment');
  }

  // RIGHT COLUMN: Main content (tabs)
  let rightCol = null;
  rightCol = mainGrid.querySelector('.tabs.panelcontainer');

  // Compose left column content
  let leftColContent = [];
  if (leftCol) {
    // Title
    const title = leftCol.querySelector('.cmp-contentfragment__title');
    if (title) leftColContent.push(title.cloneNode(true));
    // Elements (dl)
    const elements = leftCol.querySelector('.cmp-contentfragment__elements');
    if (elements) leftColContent.push(elements.cloneNode(true));
    // Share title ("Share this Adventure")
    const shareTitle = columns.length > 1 ? columns[1].querySelector('.cmp-title__text') : null;
    if (shareTitle) leftColContent.push(shareTitle.cloneNode(true));
    // Share buttons
    if (columns.length > 2) {
      const shareDiv = columns[2];
      const shareBtns = [];
      shareDiv.childNodes.forEach(node => {
        if (node.nodeType === 1) {
          shareBtns.push(node.cloneNode(true));
        }
      });
      if (shareBtns.length) leftColContent.push(...shareBtns);
    }
  }

  // Compose right column content
  let rightColContent = [];
  if (rightCol) {
    // Tabs header
    const tabsHeader = rightCol.querySelector('.cmp-tabs__tablist');
    if (tabsHeader) rightColContent.push(tabsHeader.cloneNode(true));
    // Only the Overview tabpanel is shown by default
    const overviewPanel = rightCol.querySelector('.cmp-tabs__tabpanel--active');
    if (overviewPanel) {
      const overviewFragment = overviewPanel.querySelector('article.cmp-contentfragment');
      if (overviewFragment) {
        // Get all content inside .cmp-contentfragment__elements
        const overviewElements = overviewFragment.querySelector('.cmp-contentfragment__elements');
        if (overviewElements) {
          // Instead of only direct children, grab all content blocks inside
          Array.from(overviewElements.children).forEach(child => {
            if (child.nodeType === 1 && child.textContent.trim() !== '') {
              rightColContent.push(child.cloneNode(true));
            }
            // If the child contains further blocks (like images, headings, paragraphs), include them
            Array.from(child.querySelectorAll('h3, p, img, ul, ol, div')).forEach(subChild => {
              if (subChild.textContent.trim() !== '' || subChild.tagName === 'IMG') {
                rightColContent.push(subChild.cloneNode(true));
              }
            });
          });
        }
      }
    }
  }

  // --- FIX: Ensure all text content from the right column is included ---
  // If rightColContent is still empty, try to get all text from the Overview tab
  if (rightCol && rightColContent.length === 0) {
    const overviewPanel = rightCol.querySelector('.cmp-tabs__tabpanel--active');
    if (overviewPanel) {
      // Get all text and elements inside the active tabpanel
      Array.from(overviewPanel.querySelectorAll('h3, p, img, ul, ol, div')).forEach(node => {
        if (node.textContent.trim() !== '' || node.tagName === 'IMG') {
          rightColContent.push(node.cloneNode(true));
        }
      });
    }
  }

  // Build the table structure
  const headerRow = ['Columns (columns14)'];
  const contentRow = [
    leftColContent.length ? leftColContent : '',
    rightColContent.length ? rightColContent : ''
  ];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
