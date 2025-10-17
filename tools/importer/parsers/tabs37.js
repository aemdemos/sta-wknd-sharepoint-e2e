/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab headers (labels)
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: If mismatch in number of tabs and panels, abort
  if (tabLabels.length !== tabPanels.length) return;

  // Header row as per block requirement
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // Extract the main heading (outside tabs)
  let mainHeading = element.querySelector('.cmp-title__text, h1, h2, h3');
  let headingDiv = null;
  if (mainHeading) {
    headingDiv = document.createElement('div');
    headingDiv.appendChild(mainHeading.cloneNode(true));
  }

  // Extract the sidebar info (Activity, Adventure Type, etc.)
  let sidebar = element.querySelector('.cmp-contentfragment__elements');
  let sidebarDiv = null;
  if (sidebar) {
    sidebarDiv = document.createElement('div');
    sidebarDiv.appendChild(sidebar.cloneNode(true));
  }

  // Extract the 'Share this Adventure' section if present
  let shareTitle = element.querySelector('.cmp-title__text, h5, h6');
  let shareSection = element.querySelector('.sharing');
  let shareDiv = null;
  if (shareTitle && shareTitle.textContent.trim().toLowerCase().includes('share')) {
    shareDiv = document.createElement('div');
    shareDiv.appendChild(shareTitle.cloneNode(true));
    if (shareSection) shareDiv.appendChild(shareSection.cloneNode(true));
  }

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;
    const contentDiv = document.createElement('div');

    // For the Overview tab, include heading, sidebar, share, description, image/caption
    if (label.toLowerCase() === 'overview') {
      if (headingDiv) contentDiv.appendChild(headingDiv.cloneNode(true));
      if (sidebarDiv) contentDiv.appendChild(sidebarDiv.cloneNode(true));
      if (shareDiv) contentDiv.appendChild(shareDiv.cloneNode(true));
      // Find all paragraphs (may be multiple)
      panel.querySelectorAll('p').forEach(p => contentDiv.appendChild(p.cloneNode(true)));
      // Find the image and caption
      const imgDiv = panel.querySelector('.cmp-image');
      if (imgDiv) {
        const img = imgDiv.querySelector('img');
        if (img) contentDiv.appendChild(img.cloneNode(true));
        const caption = imgDiv.querySelector('.cmp-image__title');
        if (caption) {
          const captionDiv = document.createElement('div');
          captionDiv.textContent = caption.textContent;
          contentDiv.appendChild(captionDiv);
        }
      }
    } else {
      // For other tabs, include all direct children of the tabpanel that are meaningful (skip empty grids)
      Array.from(panel.children).forEach((node) => {
        // Skip empty grid divs
        if (
          node.tagName === 'DIV' &&
          node.classList.contains('aem-Grid') &&
          node.textContent.trim() === ''
        ) {
          return;
        }
        contentDiv.appendChild(node.cloneNode(true));
      });
    }
    rows.push([label, contentDiv]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
