/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get first direct child with a class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find main image (background image)
  let mainImg = null;
  // The first .image block inside the top grid is the hero image
  const topGrid = element.querySelector('.aem-Grid');
  if (topGrid) {
    const mainImageDiv = getChildByClass(topGrid, 'image');
    if (mainImageDiv) {
      const cmpImage = mainImageDiv.querySelector('.cmp-image');
      if (cmpImage) {
        mainImg = cmpImage.querySelector('img');
      }
    }
  }

  // Find the main content area (the second main.container)
  let mainContent = null;
  const mainContainers = element.querySelectorAll('main.container');
  if (mainContainers.length > 1) {
    mainContent = mainContainers[1];
  } else if (mainContainers.length > 0) {
    mainContent = mainContainers[0];
  }

  // Get the main title and subheading
  let title = '';
  let subheading = '';
  if (mainContent) {
    const titleDivs = mainContent.querySelectorAll('.title');
    if (titleDivs.length > 0) {
      // First title is the main headline
      const h1 = titleDivs[0].querySelector('h1');
      if (h1) title = h1.outerHTML;
      // Second title is the subheading/byline
      if (titleDivs.length > 1) {
        const h4 = titleDivs[1].querySelector('h4');
        if (h4) subheading = h4.outerHTML;
      }
    }
  }

  // Compose the text block (title, subheading, no CTA)
  let textBlock = [];
  if (title) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = title;
    textBlock.push(tempDiv.firstChild);
  }
  if (subheading) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = subheading;
    textBlock.push(tempDiv.firstChild);
  }

  // Table rows
  const headerRow = ['Hero (hero32)'];
  const imageRow = [mainImg ? mainImg : ''];
  const textRow = [textBlock.length ? textBlock : ''];

  // Create the block table
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
