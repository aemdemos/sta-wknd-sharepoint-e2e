/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the article)
  const mainContent = element.querySelector('main.container');
  if (!mainContent) return;

  // Find the main article block
  const contentFragmentArticle = mainContent.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!contentFragmentArticle) return;

  // Get all content elements
  const contentElements = contentFragmentArticle.querySelector('.cmp-contentfragment__elements');
  if (!contentElements) return;

  // Helper: get all children as array
  const children = Array.from(contentElements.children);

  // Find the main title for the intro
  let mainTitle = contentFragmentArticle.querySelector('.cmp-contentfragment__title h3');
  let introTitle = null;
  if (mainTitle) {
    introTitle = mainTitle.cloneNode(true);
  } else {
    introTitle = document.createElement('span');
    introTitle.textContent = 'Introduction';
  }

  // Gather intro content (before first .title.cmp-title--underline)
  const introContent = [];
  let idx = 0;
  for (; idx < children.length; idx++) {
    const el = children[idx];
    if (el.classList.contains('title') && el.classList.contains('cmp-title--underline')) {
      break;
    }
    introContent.push(el);
  }

  // Find blockquote section (quote)
  let quoteIdx = -1;
  let quoteTitle = null;
  let quoteContent = null;
  for (let i = idx; i < children.length; i++) {
    const el = children[i];
    const blockquote = el.querySelector && el.querySelector('blockquote');
    if (blockquote) {
      quoteIdx = i;
      quoteTitle = blockquote.cloneNode(true);
      quoteContent = [el];
      break;
    }
  }

  // Now, collect all sections: each starts with .title.cmp-title--underline
  const sections = [];
  let sectionTitle = null;
  let sectionContent = [];
  let afterQuote = quoteIdx !== -1 ? quoteIdx + 1 : idx;
  for (let i = afterQuote; i < children.length; i++) {
    const el = children[i];
    if (el.classList.contains('title') && el.classList.contains('cmp-title--underline')) {
      // Get the h2 title for the section
      const h2 = el.querySelector('h2.cmp-title__text');
      sectionTitle = h2 ? h2.cloneNode(true) : null;
      sectionContent = [];
      // Find all content until the next section title or end
      for (let j = i + 1; j < children.length; j++) {
        const nextEl = children[j];
        if (nextEl.classList.contains('title') && nextEl.classList.contains('cmp-title--underline')) {
          break;
        }
        sectionContent.push(nextEl);
        i = j;
      }
      if (sectionTitle && sectionContent.length && sectionContent.some(el => el.textContent.trim())) {
        sections.push([sectionTitle, sectionContent.slice()]);
      }
    }
  }

  // Compose accordion rows
  const headerRow = ['Accordion (accordion19)'];
  const rows = [headerRow];

  // Add intro as first accordion item (if it has meaningful content)
  if (introContent.length && introContent.some(el => el.textContent.trim())) {
    rows.push([introTitle, introContent]);
  }

  // Add quote block as its own accordion item
  if (quoteTitle && quoteContent) {
    rows.push([quoteTitle, quoteContent]);
  }

  // Add each skatepark section
  sections.forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
