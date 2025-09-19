'use client';

import { cn } from '@/lib/utils';
import { type ComponentProps, memo, useMemo } from 'react';
import { Streamdown } from 'streamdown';
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationSource,
} from './inline-citation';

type ResponseWithCitationsProps = ComponentProps<typeof Streamdown>;

export const ResponseWithCitations = memo(
  ({ className, children, ...props }: ResponseWithCitationsProps) => {
    // Process the text to replace <cite> tags with inline citation components
    const processedContent = useMemo(() => {
      if (typeof children !== 'string') return children;

      // Regular expression to match text with <cite> tags
      // Matches patterns like: **Job Title** <cite>domain.com</cite>
      const citePattern = /\*\*([^*]+)\*\*\s*<cite>([^<]+)<\/cite>/g;

      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = citePattern.exec(children)) !== null) {
        // Add text before the citation
        if (match.index > lastIndex) {
          parts.push(children.slice(lastIndex, match.index));
        }

        const text = match[1];
        const domain = match[2];

        // Create citation component
        parts.push(
          <InlineCitation key={match.index}>
            <InlineCitationText>
              <strong>{text}</strong>
            </InlineCitationText>
            <InlineCitationCard>
              <InlineCitationCardTrigger sources={[`https://${domain}`]} />
              <InlineCitationCardBody>
                <InlineCitationSource
                  title={text}
                  url={`https://${domain}`}
                  description={`Source: ${domain}`}
                />
              </InlineCitationCardBody>
            </InlineCitationCard>
          </InlineCitation>
        );

        lastIndex = citePattern.lastIndex;
      }

      // Add remaining text after last citation
      if (lastIndex < children.length) {
        parts.push(children.slice(lastIndex));
      }

      // If no citations found, return original content
      return parts.length > 0 ? parts : children;
    }, [children]);

    return (
      <Streamdown
        className={cn(
          'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_code]:whitespace-pre-wrap [&_code]:break-words [&_pre]:max-w-full [&_pre]:overflow-x-auto',
          className,
        )}
        {...props}
      >
        {typeof processedContent === 'string' ? processedContent : children}
      </Streamdown>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

ResponseWithCitations.displayName = 'ResponseWithCitations';