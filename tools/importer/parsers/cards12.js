/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor/guide cards (sections)
  const sections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Helper: get heading and intro preceding a block of sections
  function getTitleAndIntro(idx) {
    // Find all block titles (h2)
    const titles = Array.from(element.querySelectorAll('.title.cmp-title--underline'));
    const heading = titles[idx]?.querySelector('.cmp-title__text') || null;
    let intro = null;
    if (heading) {
      // Find the next .text.cmp-text--font-small after this .title
      let el = titles[idx].nextElementSibling;
      while (el) {
        if (el.classList.contains('text') && el.classList.contains('cmp-text--font-small')) {
          intro = el;
          break;
        }
        el = el.nextElementSibling;
      }
    }
    return { heading, intro };
  }

  // Helper: extract card data
  function getCard(section) {
    const img = section.querySelector('.image img');
    // Find name/title and subtitle/role
    const name = section.querySelector('.title .cmp-title__text');
    // Subtitle is h5 or second .cmp-title__text
    let subtitle = null;
    const tEls = section.querySelectorAll('.title .cmp-title__text');
    if (tEls.length > 1) subtitle = tEls[1];
    if (!subtitle) subtitle = section.querySelector('h5.cmp-title__text');
    // Find all social buttons
    const btnSection = section.querySelector('.buildingblock.responsivegrid.cmp-buildingblock--btn-list .aem-Grid');
    const buttons = btnSection ? Array.from(btnSection.querySelectorAll('a.cmp-button')) : [];

    // Structure text cell: name, subtitle, then buttons
    const textContent = [];
    if (name) {
      // Reference the <h3> or <span> directly
      textContent.push(name);
    }
    if (subtitle) {
      textContent.push(subtitle);
    }
    if (buttons.length) {
      // Add all buttons as reference
      textContent.push(...buttons);
    }
    return [img, textContent];
  }

  // Build block table
  const cells = [];
  cells.push(['Cards (cards12)']);

  // Contributors block: first 4 sections
  const contributors = sections.slice(0, 4);
  const contribInfo = getTitleAndIntro(0);
  if (contribInfo.heading) {
    // Reference heading and intro
    const headerCell = [contribInfo.heading];
    if (contribInfo.intro) headerCell.push(contribInfo.intro);
    cells.push([headerCell]);
  }
  contributors.forEach(sec => {
    cells.push(getCard(sec));
  });

  // Guides block: next 3 sections
  const guides = sections.slice(4, 7);
  const guidesInfo = getTitleAndIntro(1);
  if (guidesInfo.heading) {
    const guideHeaderCell = [guidesInfo.heading];
    if (guidesInfo.intro) guideHeaderCell.push(guidesInfo.intro);
    cells.push([guideHeaderCell]);
  }
  guides.forEach(sec => {
    cells.push(getCard(sec));
  });

  // Create table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
