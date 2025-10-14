/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns29)'];

  // --- MAIN COLUMN ---
  let mainColumn = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (!mainColumn) {
    const mains = Array.from(element.querySelectorAll('main.container.responsivegrid'));
    if (mains.length > 1) {
      mainColumn = mains.reduce((a, b) => (a.textContent.length > b.textContent.length ? a : b));
    } else {
      mainColumn = mains[0] || document.createElement('div');
    }
  }

  const mainContent = document.createElement('div');

  // Add hero image and breadcrumb if present
  const heroImageEl = element.querySelector('.container.responsivegrid > .cmp-container > .aem-Grid > .image .cmp-image');
  if (heroImageEl) mainContent.appendChild(heroImageEl.cloneNode(true));
  const breadcrumbEl = element.querySelector('.container.responsivegrid > .cmp-container > .aem-Grid > .breadcrumb nav');
  if (breadcrumbEl) mainContent.appendChild(breadcrumbEl.cloneNode(true));

  // Helper to add all meaningful content in order
  function addContent(node) {
    if (node.nodeType === 1) {
      if (
        node.matches('h1,h2,h3,h4,h5,p,blockquote,.cmp-title,.cmp-contentfragment,.cmp-text,.cmp-byline,.image .cmp-image')
      ) {
        mainContent.appendChild(node.cloneNode(true));
      } else if (node.children.length) {
        Array.from(node.children).forEach(addContent);
      }
    }
  }
  addContent(mainColumn);

  // Add the author byline social buttons (Facebook, Twitter, Instagram) if present under the byline
  const bylineBlock = mainColumn.querySelector('.cmp-byline');
  if (bylineBlock) {
    let btnList = null;
    let sibling = bylineBlock.parentElement.nextElementSibling;
    while (sibling) {
      if (sibling.classList && sibling.classList.contains('cmp-buildingblock--btn-list')) {
        btnList = sibling;
        break;
      }
      sibling = sibling.nextElementSibling;
    }
    if (btnList) {
      const buttons = btnList.querySelectorAll('.cmp-button');
      buttons.forEach(btn => {
        mainContent.appendChild(btn.cloneNode(true));
      });
    }
  }

  // --- SIDEBAR COLUMN ---
  let sidebarColumn = element.querySelector('aside.container.responsivegrid');
  if (!sidebarColumn) {
    sidebarColumn = element.querySelector('.cmp-layoutcontainer--sidebar') || document.createElement('div');
  }
  // Only extract the sidebar's content, not the outer container wrappers
  const sidebarContent = document.createElement('div');
  // Find the sidebar's main content blocks
  const sidebarBlocks = sidebarColumn.querySelectorAll('.title, .sharing, .list');
  sidebarBlocks.forEach(block => {
    // Fix: Convert Facebook share button to a usable link with label
    if (block.classList.contains('sharing')) {
      // Facebook share button
      const fbShare = block.querySelector('.fb-share-button');
      if (fbShare && fbShare.dataset && fbShare.dataset.href) {
        const fbLink = document.createElement('a');
        fbLink.href = fbShare.dataset.href;
        fbLink.textContent = 'Facebook';
        sidebarContent.appendChild(fbLink);
      }
      // Pinterest button
      const pinBtn = block.querySelector('a[data-pin-do]');
      if (pinBtn) {
        const pinLink = document.createElement('a');
        pinLink.href = pinBtn.href;
        pinLink.textContent = 'Pinterest';
        sidebarContent.appendChild(pinLink);
      }
    } else {
      sidebarContent.appendChild(block.cloneNode(true));
    }
  });

  // Compose the columns row
  const columnsRow = [mainContent, sidebarContent];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
