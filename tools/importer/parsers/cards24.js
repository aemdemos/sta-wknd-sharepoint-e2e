/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor/guide section
  function getCard(section) {
    // Find image (first .image img)
    const img = section.querySelector('.image img');
    // Find name (first .title h3)
    const name = section.querySelector('.title h3');
    // Find subtitle (first .title h5)
    const subtitle = section.querySelector('.title h5');
    // Find all social links (all .cmp-button inside .buildingblock)
    let links = [];
    const buildingBlocks = section.querySelectorAll('.buildingblock');
    for (const block of buildingBlocks) {
      links = links.concat(Array.from(block.querySelectorAll('.cmp-button')));
    }
    // Compose text cell: name, subtitle, links
    const cellContent = [];
    if (name) cellContent.push(name);
    if (subtitle) cellContent.push(subtitle);
    if (links.length > 0) {
      const linksContainer = document.createElement('div');
      links.forEach(link => linksContainer.appendChild(link));
      cellContent.push(linksContainer);
    }
    return [img, cellContent];
  }

  // Find the grid container (the main container)
  const grid = element;

  // Find the relevant titles and intro text for each section
  const sectionGroups = [];
  // Contributors section
  {
    // Find the 'Our Contributors' title
    const contributorsTitle = grid.querySelector('.title.cmp-title--underline h2.cmp-title__text');
    // Find the intro text that follows it
    let contributorsIntro = null;
    let nextSibling = contributorsTitle && contributorsTitle.closest('.title') && contributorsTitle.closest('.title').nextElementSibling;
    if (nextSibling && nextSibling.classList.contains('text')) {
      contributorsIntro = nextSibling.querySelector('.cmp-text');
    }
    // Find all contributor sections before the next section (the title 'WKND Guides')
    const contributorSections = [];
    let node = nextSibling && nextSibling.nextElementSibling;
    while (node && !(node.matches('.title.cmp-title--underline'))) {
      if (node.tagName === 'SECTION' && node.classList.contains('cmp-experience-fragment--contributor')) {
        contributorSections.push(node);
      }
      node = node.nextElementSibling;
    }
    sectionGroups.push({
      title: contributorsTitle,
      intro: contributorsIntro,
      cards: contributorSections
    });
  }
  // Guides section
  {
    // Find the 'WKND Guides' title
    const guidesTitle = grid.querySelectorAll('.title.cmp-title--underline h2.cmp-title__text')[1];
    // Find the intro text that follows it
    let guidesIntro = null;
    let guidesTitleDiv = guidesTitle && guidesTitle.closest('.title');
    let nextSibling = guidesTitleDiv && guidesTitleDiv.nextElementSibling;
    if (nextSibling && nextSibling.classList.contains('text')) {
      guidesIntro = nextSibling.querySelector('.cmp-text');
    }
    // Find all contributor sections after the 'WKND Guides' title until the end
    const guideSections = [];
    let node = nextSibling && nextSibling.nextElementSibling;
    while (node) {
      if (node.tagName === 'SECTION' && node.classList.contains('cmp-experience-fragment--contributor')) {
        guideSections.push(node);
      }
      node = node.nextElementSibling;
    }
    sectionGroups.push({
      title: guidesTitle,
      intro: guidesIntro,
      cards: guideSections
    });
  }

  // Compose output: for each section, add title, intro, then block table
  const outputElements = [];
  for (const group of sectionGroups) {
    if (group.title) {
      outputElements.push(group.title);
    }
    if (group.intro) {
      outputElements.push(group.intro);
    }
    if (group.cards && group.cards.length > 0) {
      const cells = [
        ['Cards (cards24)'],
        ...group.cards.map(getCard)
      ];
      const block = WebImporter.DOMUtils.createTable(cells, document);
      outputElements.push(block);
    }
  }

  // Replace the original element with all new content
  element.replaceWith(...outputElements);
}
