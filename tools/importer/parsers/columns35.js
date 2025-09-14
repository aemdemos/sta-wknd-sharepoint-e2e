/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the big 8-column main)
  const mainContent = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (!mainContent) return;

  // Find the sidebar (the 3-column aside)
  const sidebar = element.querySelector('aside.container.responsivegrid.cmp-layoutcontainer--sidebar');
  if (!sidebar) return;

  // --- COLUMN 1: Main Content ---
  // We'll collect the main content as a single cell, but flatten out nested blocks
  const mainColumnContent = [];

  // Title (h1)
  const titleBlock = mainContent.querySelector('.title .cmp-title__text');
  if (titleBlock) mainColumnContent.push(titleBlock.cloneNode(true));

  // Author (h4)
  const authorBlock = mainContent.querySelector('.title + .title .cmp-title__text');
  if (authorBlock) mainColumnContent.push(authorBlock.cloneNode(true));

  // Article (contentfragment) - flatten: only keep the content, not the wrapper
  const articleBlock = mainContent.querySelector('article.contentfragment');
  if (articleBlock) {
    // Get all direct children except the title
    const cfTitle = articleBlock.querySelector('.cmp-contentfragment__title');
    if (cfTitle) mainColumnContent.push(cfTitle.cloneNode(true));
    const cfElements = articleBlock.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      Array.from(cfElements.childNodes).forEach((node) => {
        // Only keep element nodes with content
        if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('img'))) {
          mainColumnContent.push(node.cloneNode(true));
        }
      });
    }
  }

  // Byline block (experiencefragment) - flatten: only keep the byline content
  const bylineBlock = mainContent.querySelector('.experiencefragment .cmp-byline');
  if (bylineBlock) mainColumnContent.push(bylineBlock.cloneNode(true));

  // --- COLUMN 2: Sidebar ---
  // We'll collect the sidebar block as a single element
  const sidebarContent = [];

  // Share title
  const shareTitle = sidebar.querySelector('.title .cmp-title__text');
  if (shareTitle) sidebarContent.push(shareTitle.cloneNode(true));

  // Sharing buttons
  const sharingBlock = sidebar.querySelector('.sharing');
  if (sharingBlock) sidebarContent.push(sharingBlock.cloneNode(true));

  // Upnext list
  const upnextList = sidebar.querySelector('.list');
  if (upnextList) sidebarContent.push(upnextList.cloneNode(true));

  // --- TABLE STRUCTURE ---
  // Header row
  const headerRow = ['Columns (columns35)'];
  // Content row: [main content, sidebar]
  const contentRow = [mainColumnContent, sidebarContent];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
