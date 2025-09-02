/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: first row is the header, then each row is [title, content]
  const headerRow = ['Accordion (accordion17)'];
  const cells = [headerRow];

  // Find all immediate children that could be FAQ/accordion pairs
  // Common patterns: <div><h3>Question?</h3><p>Answer</p></div> OR adjacent <p>Question?</p> <div>Answer...</div>
  // We'll look for adjacent question-and-answer pairs

  // Helper to check if an element is a valid question/title
  function isAccordionTitle(el) {
    if (!el) return false;
    // Accept headings and paragraphs/divs that end with a '?'
    const tag = el.tagName.toLowerCase();
    if (['h1','h2','h3','h4','h5','h6','p','div','span'].includes(tag)) {
      const txt = el.textContent.trim();
      return txt.endsWith('?');
    }
    return false;
  }

  // We'll get all direct children of the element
  const directChildren = Array.from(element.children);

  let i = 0;
  while (i < directChildren.length) {
    const titleEl = directChildren[i];
    if (isAccordionTitle(titleEl)) {
      // Collect all following siblings that are not a title as content until next title or end
      let contentEls = [];
      let j = i + 1;
      while (j < directChildren.length && !isAccordionTitle(directChildren[j])) {
        contentEls.push(directChildren[j]);
        j++;
      }
      // Only add if there's actual content
      if (contentEls.length > 0) {
        cells.push([
          titleEl,
          contentEls.length === 1 ? contentEls[0] : contentEls
        ]);
      }
      i = j;
    } else {
      i++;
    }
  }

  // Edge case: If nothing found, fallback to paragraphs as question/answer pairs
  if (cells.length === 1) {
    const allPs = Array.from(element.querySelectorAll('p'));
    for (let k = 0; k < allPs.length; k++) {
      const p = allPs[k];
      const txt = p.textContent.trim();
      if (txt.endsWith('?')) {
        // Answer paragraphs until next question
        let answerParts = [];
        let m = k + 1;
        while (m < allPs.length && !allPs[m].textContent.trim().endsWith('?')) {
          answerParts.push(allPs[m]);
          m++;
        }
        if (answerParts.length > 0) {
          cells.push([
            p,
            answerParts.length === 1 ? answerParts[0] : answerParts
          ]);
        }
        k = m - 1;
      }
    }
  }

  // Final fallback: treat each paragraph as a single item if still empty
  if (cells.length === 1) {
    const fallbackPs = Array.from(element.querySelectorAll('p'));
    fallbackPs.forEach(p => {
      cells.push([p, p]);
    });
  }

  // Create table using referenced elements
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
