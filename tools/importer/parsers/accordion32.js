/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from the article content
  function extractAccordionItems(article) {
    const items = [];
    // Find all h2 titles (accordion section titles)
    const h2s = article.querySelectorAll('h2.cmp-title__text');
    // The article intro before the first h2 is also an accordion item
    // Find the main title and author
    const mainTitle = article.querySelector('h3.cmp-contentfragment__title');
    const authorTitle = document.querySelector('h4.cmp-title__text');
    // Compose intro title
    let introTitle = mainTitle ? mainTitle.textContent.trim() : '';
    if (authorTitle) {
      introTitle += ' - ' + authorTitle.textContent.trim();
    }
    // Compose intro content: all elements before first h2
    const introContent = [];
    // Get all children of cmp-contentfragment__elements
    const cfElements = article.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      let reachedFirstH2 = false;
      for (const child of cfElements.children) {
        // If child contains an h2, stop
        if (child.querySelector && child.querySelector('h2.cmp-title__text')) {
          reachedFirstH2 = true;
          break;
        }
        // Otherwise, add paragraphs, images, blockquotes, etc.
        if ((child.tagName === 'P' || child.tagName === 'BLOCKQUOTE') && child.textContent.trim()) {
          introContent.push(child.cloneNode(true));
        } else if (child.querySelector && child.querySelector('.cmp-image__image')) {
          const img = child.querySelector('.cmp-image');
          if (img) introContent.push(img.cloneNode(true));
        }
      }
    }
    // Also include the main image above the article
    const mainImg = document.querySelector('.image .cmp-image__image');
    if (mainImg) {
      const imgBlock = mainImg.closest('.cmp-image');
      if (imgBlock) introContent.unshift(imgBlock.cloneNode(true));
    }
    // Remove any empty elements from introContent
    const filteredIntroContent = introContent.filter(el => {
      if (!el) return false;
      if (el.tagName === 'P' || el.tagName === 'BLOCKQUOTE') {
        return el.textContent.trim().length > 0;
      }
      if (el.classList && el.classList.contains('cmp-image')) {
        return true;
      }
      return false;
    });
    if (filteredIntroContent.length > 0) {
      items.push([introTitle, filteredIntroContent]);
    }
    // Now, for each h2, collect its content until the next h2
    for (let i = 0; i < h2s.length; i++) {
      const title = h2s[i].textContent.trim();
      // Find all elements between this h2 and the next h2
      const sectionContent = [];
      // Start from the h2's parent and go forward
      let node = h2s[i].parentElement.parentElement.parentElement.nextElementSibling;
      while (node && (!node.querySelector || !node.querySelector('h2.cmp-title__text'))) {
        if ((node.tagName === 'P' || node.tagName === 'BLOCKQUOTE') && node.textContent.trim()) {
          sectionContent.push(node.cloneNode(true));
        } else if (node.querySelector && node.querySelector('.cmp-image__image')) {
          const img = node.querySelector('.cmp-image');
          if (img) sectionContent.push(img.cloneNode(true));
        }
        node = node.nextElementSibling;
      }
      // Remove any empty elements from sectionContent
      const filteredSectionContent = sectionContent.filter(el => {
        if (!el) return false;
        if (el.tagName === 'P' || el.tagName === 'BLOCKQUOTE') {
          return el.textContent.trim().length > 0;
        }
        if (el.classList && el.classList.contains('cmp-image')) {
          return true;
        }
        return false;
      });
      if (filteredSectionContent.length > 0) {
        items.push([title, filteredSectionContent]);
      }
    }
    return items;
  }

  // Find the main article contentfragment
  const article = element.querySelector('article.cmp-contentfragment');
  if (!article) return;

  // Build the table rows
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];
  const accordionItems = extractAccordionItems(article);
  accordionItems.forEach(([title, content]) => {
    rows.push([
      title,
      Array.isArray(content) && content.length > 0 ? content : ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
