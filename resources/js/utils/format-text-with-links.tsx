import Linkify from 'linkify-it';
import React from 'react';

// Create a linkifier instance
const linkifier = new Linkify();

function formatTextWithLinks(text: string) {
  // Find all URLs in the text
  const matches = linkifier.match(text);

  // If no URLs found, return the original text
  if (!matches) return [text]; // Directly return the original text as an array

  const result: Array<React.ReactElement | string> = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    // Add the part before the URL (if any)
    const beforeUrl = text.slice(lastIndex, match.index);
    if (beforeUrl) result.push(beforeUrl);

    // Add the URL itself as a clickable link
    result.push(
      <a
        key={index}
        href={match.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'blue', fontWeight: 'bold' }}
      >
        {match.text}
      </a>,
    );

    // Update the last index to continue after the current URL
    lastIndex = match.lastIndex;
  });

  // Add any remaining text after the last URL (if any)
  const remainingText = text.slice(lastIndex);
  if (remainingText) result.push(remainingText);

  return result;
}

export default formatTextWithLinks;
