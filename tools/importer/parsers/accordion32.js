/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];

  // Find the article with the main content
  const article = element.querySelector('article.contentfragment');
  if (!article) return;
  const fragmentRoot = article.querySelector('.cmp-contentfragment__elements');
  if (!fragmentRoot) return;

  // Prepare to split by accordion sections: look for all .cmp-title__text elements (these are the section headings)
  // Content between headings belongs to the previous heading.
  const children = Array.from(fragmentRoot.children);

  let sections = [];
  let currentTitle = null;
  let currentContent = [];

  children.forEach(child => {
    // Is this a section heading?
    const heading = child.querySelector && child.querySelector('.cmp-title__text');
    if (heading) {
      // If we already have a currentTitle, push previous section
      if (currentTitle) {
        sections.push([currentTitle, currentContent.slice()]);
      }
      currentTitle = heading;
      currentContent = [];
    } else {
      // Add content to the current section
      if (currentTitle) {
        currentContent.push(child);
      }
    }
  });
  // Push the last section
  if (currentTitle && currentContent.length) {
    sections.push([currentTitle, currentContent.slice()]);
  }

  // If no sections found (e.g. all paragraphs), fallback: each paragraph becomes a row
  if (sections.length === 0) {
    const paragraphs = Array.from(fragmentRoot.querySelectorAll('p'));
    paragraphs.forEach(p => {
      rows.push([p, document.createElement('div')]);
    });
  } else {
    // Build rows as [title, content]
    sections.forEach(([title, contentArr]) => {
      rows.push([
        title,
        contentArr.length === 1 ? contentArr[0] : contentArr
      ]);
    });
  }

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
