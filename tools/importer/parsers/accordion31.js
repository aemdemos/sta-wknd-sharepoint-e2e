/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area
  const mainContent = element.querySelector('main.container.responsivegrid.cmp-layout-container--fixed');
  if (!mainContent) return;

  // Find the main article block
  const articleContainer = mainContent.querySelector('main.container.responsivegrid');
  if (!articleContainer) return;

  // Find the contentfragment article
  const contentFragment = articleContainer.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Get all elements inside the contentfragment
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Compose the table rows
  const headerRow = ['Accordion (accordion31)'];
  const rows = [];

  // First row: Title is the article title, content is intro
  const articleTitle = contentFragment.querySelector('h3.cmp-contentfragment__title');
  let introContent = [];
  let foundFirstSection = false;
  for (const node of cfElements.childNodes) {
    if (node.nodeType === 1 && node.matches('.title')) {
      const h2 = node.querySelector('h2.cmp-title__text');
      if (h2) {
        foundFirstSection = true;
        break;
      }
    }
    if (
      node.nodeType === 1 && (
        node.tagName === 'P' ||
        node.tagName === 'BLOCKQUOTE' ||
        node.classList.contains('image') ||
        node.classList.contains('cmp-text')
      )
    ) {
      introContent.push(node);
    }
  }
  // Also check for nested grids in intro
  for (const node of cfElements.childNodes) {
    if (foundFirstSection) break;
    if (node.nodeType === 1 && node.classList.contains('aem-Grid')) {
      Array.from(node.children).forEach(child => {
        if (child.classList.contains('image') || child.classList.contains('cmp-text')) {
          introContent.push(child);
        }
      });
    }
    if (node.nodeType === 1 && node.matches('.title')) {
      const h2 = node.querySelector('h2.cmp-title__text');
      if (h2) break;
    }
  }
  if (articleTitle) {
    rows.push([
      articleTitle,
      introContent.length === 1 ? introContent[0] : introContent
    ]);
  }

  // Now extract the accordion sections
  let currentTitle = null;
  let currentContent = [];
  const children = Array.from(cfElements.childNodes).filter(node => node.nodeType === 1);
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.matches('.title')) {
      const h2 = node.querySelector('h2.cmp-title__text');
      if (h2) {
        if (currentTitle && currentContent.length) {
          rows.push([currentTitle, currentContent.length === 1 ? currentContent[0] : currentContent]);
        }
        currentTitle = h2;
        currentContent = [];
        continue;
      }
    }
    if (
      node.tagName === 'P' ||
      node.tagName === 'BLOCKQUOTE' ||
      node.classList.contains('image') ||
      node.classList.contains('cmp-text')
    ) {
      currentContent.push(node);
    }
    if (node.classList.contains('aem-Grid')) {
      Array.from(node.children).forEach(child => {
        if (
          child.classList.contains('image') ||
          child.classList.contains('cmp-text')
        ) {
          currentContent.push(child);
        }
      });
    }
  }
  if (currentTitle && currentContent.length) {
    rows.push([currentTitle, currentContent.length === 1 ? currentContent[0] : currentContent]);
  }

  // Create the block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
