/* global WebImporter */
export default function parse(element, { document }) {
  // Find main and sidebar columns
  const mainContent = element.querySelector('main.container');
  const sidebar = element.querySelector('aside.container');

  // --- COLUMN 1: Main Content ---
  const mainColumn = [];

  // Breadcrumb (as in screenshot)
  let breadcrumb = element.querySelector('.breadcrumb');
  if (breadcrumb) mainColumn.push(breadcrumb.cloneNode(true));

  // Hero image (the very first .image .cmp-image img in the whole element)
  const heroImg = element.querySelector('.image .cmp-image img');
  if (heroImg) mainColumn.push(heroImg.cloneNode(true));

  // Heading
  const heading = mainContent && mainContent.querySelector('h1');
  if (heading) mainColumn.push(heading.cloneNode(true));

  // Author byline
  const author = mainContent && mainContent.querySelector('h4');
  if (author) mainColumn.push(author.cloneNode(true));

  // Contentfragment article
  const cf = mainContent && mainContent.querySelector('.contentfragment');
  if (cf) {
    // Walk .cmp-contentfragment__elements children in order
    const cfElements = cf.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      Array.from(cfElements.children).forEach(child => {
        // If it's a div with a quote block
        if (child.querySelector && child.querySelector('blockquote')) {
          mainColumn.push(child.cloneNode(true));
        }
        // If it's a div with a section heading (h2)
        else if (child.querySelector && child.querySelector('h2')) {
          mainColumn.push(child.cloneNode(true));
        }
        // If it's a div with a section image
        else if (child.querySelector && child.querySelector('.cmp-image img')) {
          mainColumn.push(child.cloneNode(true));
        }
        // If it's a paragraph
        else if (child.tagName === 'P') {
          mainColumn.push(child.cloneNode(true));
        }
        // If it's a div with paragraphs (address or otherwise)
        else if (child.tagName === 'DIV') {
          child.querySelectorAll('p').forEach(p => mainColumn.push(p.cloneNode(true)));
        }
      });
    }
  }

  // Author profile block (bottom)
  const bylineBlock = element.querySelector('.cmp-byline');
  if (bylineBlock) {
    const bylineClone = bylineBlock.cloneNode(true);
    // Attach social buttons if present
    const socialBtns = element.querySelectorAll('.cmp-button');
    if (socialBtns.length) {
      const socialDiv = document.createElement('div');
      socialBtns.forEach(btn => socialDiv.appendChild(btn.cloneNode(true)));
      bylineClone.appendChild(socialDiv);
    }
    mainColumn.push(bylineClone);
  }

  // --- COLUMN 2: Sidebar ---
  const sidebarColumn = [];
  if (sidebar) {
    // Share title
    const shareTitle = sidebar.querySelector('h5');
    if (shareTitle) sidebarColumn.push(shareTitle.cloneNode(true));
    // Share buttons (fb, pinterest)
    const shareBtns = sidebar.querySelectorAll('.sharing a, .fb-share-button');
    shareBtns.forEach(btn => sidebarColumn.push(btn.cloneNode(true)));
    // Download block
    const downloadBlock = sidebar.querySelector('.cmp-download');
    if (downloadBlock) sidebarColumn.push(downloadBlock.cloneNode(true));
    // Related articles list
    const relatedList = sidebar.querySelector('.cmp-list');
    if (relatedList) sidebarColumn.push(relatedList.cloneNode(true));
  }

  // --- TABLE STRUCTURE ---
  const headerRow = ['Columns (columns19)'];
  const secondRow = [mainColumn, sidebarColumn];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  element.replaceWith(table);
}
