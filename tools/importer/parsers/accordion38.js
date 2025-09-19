/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children by class
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter((el) => el.classList.contains(className));
  }

  // Find the main contentfragment article
  const cfArticle = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;

  // Get the content fragment title (h3)
  const cfTitle = cfArticle.querySelector('.cmp-contentfragment__title');
  // Get the main content container
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll collect accordion items as [title, content]
  const rows = [];

  // Header row
  const headerRow = ['Accordion (accordion38)'];
  rows.push(headerRow);

  // 1. Introduction (first accordion item)
  // Title: Main article title
  // Content: Byline + first paragraph + quote block
  let introTitle = null;
  let introContent = [];

  // Get the h3 title
  if (cfTitle) {
    introTitle = cfTitle.textContent.trim();
  }

  // Get author byline (h4)
  const authorTitle = cfElements.querySelector('.title .cmp-title__text');
  if (authorTitle && authorTitle.tagName === 'H4') {
    introContent.push(authorTitle);
  }

  // Get first paragraph (history)
  const introParagraph = cfElements.querySelector('p');
  if (introParagraph) {
    introContent.push(introParagraph);
  }

  // Get quote block
  const quoteBlock = cfElements.querySelector('.cmp-text blockquote');
  const quoteAuthor = cfElements.querySelector('.cmp-text p');
  if (quoteBlock) {
    introContent.push(quoteBlock);
  }
  if (quoteAuthor) {
    introContent.push(quoteAuthor);
  }

  rows.push([
    introTitle,
    introContent,
  ]);

  // 2. Vans Off the Wall Skatepark
  // Title: h2 ("Vans Off the Wall Skatepark")
  // Content: paragraph, image, address
  const vansTitle = cfElements.querySelector('#title-3488a9a7a7 .cmp-title__text');
  const vansPara = Array.from(cfElements.querySelectorAll('p')).find(p => p.textContent.includes('Vans off the Wall Skatepark'));
  const vansImg = cfElements.querySelector('#image-143f3c2fd0 img');
  const vansAddr = Array.from(cfElements.querySelectorAll('p')).find(p => p.textContent.includes('Center Avenue Huntington Beach'));
  let vansContent = [];
  if (vansPara) vansContent.push(vansPara);
  if (vansImg) vansContent.push(vansImg);
  if (vansAddr) vansContent.push(vansAddr);

  rows.push([
    vansTitle ? vansTitle.textContent.trim() : 'Vans Off the Wall Skatepark',
    vansContent,
  ]);

  // 3. Moorpark skate park
  const moorparkTitle = cfElements.querySelector('#title-20005c1daf .cmp-title__text');
  const moorparkPara = Array.from(cfElements.querySelectorAll('p')).find(p => p.textContent.includes('Moorpark Skate Park'));
  const moorparkAddr = Array.from(cfElements.querySelectorAll('p')).find(p => p.textContent.includes('Poindexter ave'));
  let moorparkContent = [];
  if (moorparkPara) moorparkContent.push(moorparkPara);
  if (moorparkAddr) moorparkContent.push(moorparkAddr);

  rows.push([
    moorparkTitle ? moorparkTitle.textContent.trim() : 'Moorpark skate park',
    moorparkContent,
  ]);

  // 4. Venice Beach Skatepark
  const veniceTitle = cfElements.querySelector('#title-6e483549c9 .cmp-title__text');
  const venicePara = Array.from(cfElements.querySelectorAll('p')).find(p => p.textContent.includes('Venice Beach Skate Park'));
  const veniceImg = cfElements.querySelector('#image-eb518c689e img');
  const veniceAddr = Array.from(cfElements.querySelectorAll('p')).find(p => p.textContent.includes('Ocean Front Walk Venice'));
  let veniceContent = [];
  if (veniceImg) veniceContent.push(veniceImg);
  if (venicePara) veniceContent.push(venicePara);
  if (veniceAddr) veniceContent.push(veniceAddr);

  rows.push([
    veniceTitle ? veniceTitle.textContent.trim() : 'Venice Beach Skatepark',
    veniceContent,
  ]);

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
