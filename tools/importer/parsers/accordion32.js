/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion expects: header row, then N rows of [title, content]
  // Each row: title cell (heading or text), content cell (body, possibly rich content)
  // Source: the main article structure with h2s as accordion titles and blocks of content as content

  // 1. Find the main content block (the article)
  let article = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!article) {
    article = element.querySelector('article');
  }
  if (!article) {
    // fallback: search for main article in all descendants
    article = element.querySelector('[data-cmp-contentfragment-model]');
  }
  if (!article) return;

  // 2. Find all accordion sections: these start with a heading (h2 with class 'cmp-title__text'),
  // and all content until the next such heading is the content for that section.
  // Also, some intro content before first h2.

  // Get all direct children of the main article's .cmp-contentfragment__elements or the article itself
  let contentRoot = article.querySelector('.cmp-contentfragment__elements') || article;
  let nodes = Array.from(contentRoot.childNodes).filter(n => {
    // Eliminate empty text nodes
    if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') return false;
    return true;
  });

  // We'll scan for h2.cmp-title__text or h2, and treat those as section titles.
  // Everything before first h2 is intro, after each h2 is body.
  // There may be images, blockquotes, etc. interleaved.
  let accordions = [];

  // Buffer for accumulating nodes
  let currentTitle = null;
  let currentContent = [];
  function flushSection() {
    if (currentTitle) {
      // Remove leading/trailing whitespace text nodes in content
      while (currentContent.length && currentContent[0].nodeType === Node.TEXT_NODE && currentContent[0].textContent.trim() === '') currentContent.shift();
      while (currentContent.length && currentContent[currentContent.length-1].nodeType === Node.TEXT_NODE && currentContent[currentContent.length-1].textContent.trim() === '') currentContent.pop();
      if (currentContent.length === 1) {
        accordions.push([currentTitle, currentContent[0]]);
      } else {
        accordions.push([currentTitle, currentContent]);
      }
    }
    currentTitle = null;
    currentContent = [];
  }

  // Collect intro content (before first h2, if any), treat as a section if found
  let i = 0;
  // Collect initial paragraphs or content before first h2
  let introContent = [];
  for (; i < nodes.length; i++) {
    let node = nodes[i];
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.match(/^H[1-6]$/i) && node.classList.contains('cmp-title__text')) {
      break;
    }
    introContent.push(node);
  }
  if (introContent.length) {
    // Use first h3 or h1 as the intro title if present, else use article title
    let mainTitle = article.querySelector('h3.cmp-contentfragment__title, h1.cmp-title__text');
    let titleElem = mainTitle ? mainTitle.cloneNode(true) : document.createElement('span');
    if (!mainTitle) titleElem.textContent = 'Intro';
    accordions.push([titleElem, introContent.length === 1 ? introContent[0] : introContent]);
  }

  // Now parse sections
  for (; i < nodes.length; i++) {
    let node = nodes[i];
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.match(/^H[1-6]$/i) && node.classList.contains('cmp-title__text')) {
      flushSection();
      currentTitle = node;
      currentContent = [];
    } else {
      if (currentTitle || accordions.length) {
        currentContent.push(node);
      }
    }
  }
  flushSection();

  // Remove empty content sections
  accordions = accordions.filter(([title, content]) => {
    if (!title) return false;
    if (Array.isArray(content)) return content.length > 0;
    return !!content;
  });

  // 3. Compose cells array
  const cells = [['Accordion (accordion32)']];
  accordions.forEach(([title, content]) => {
    // Use the title element as is
    let titleCell = title;
    // For content, if it's a single node, use as is; if array, flatten to array of nodes
    let contentCell = content;
    cells.push([titleCell, contentCell]);
  });

  // 4. Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
