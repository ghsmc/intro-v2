'use client';
import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import type { Vote } from '@/lib/db/schema';
import type { User } from 'next-auth';

const getUserInitials = (user?: User) => {
  if (!user) return 'U';
  if (user.name) {
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  return 'U';
};
import { DocumentToolResult } from './document';
import { Response } from './elements/response';
import { MessageContent } from './elements/message';
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from './elements/tool';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import equal from 'fast-deep-equal';
import { cn, sanitizeText } from '@/lib/utils';
import { MessageEditor } from './message-editor';
import { DocumentPreview } from './document-preview';
import { MessageReasoning } from './message-reasoning';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/types';
import { useDataStream } from './data-stream-provider';
import { CitedText } from './citations/CitedText';
import { SourcesSection } from './citations/SourcesSection';
import { JobsSection } from './jobs/JobsSection';
import { type CitationSource } from '@/lib/citations/utils';

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requiresScrollPadding,
  isArtifactVisible,
  user,
}: {
  chatId: string;
  message: ChatMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>['setMessages'];
  regenerate: UseChatHelpers<ChatMessage>['regenerate'];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
  isArtifactVisible: boolean;
  user?: User;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === 'file',
  );

  useDataStream();

  return (
    <motion.div
      data-testid={`message-${message.role}`}
      className="group/message w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cn('flex w-full items-start gap-2 md:gap-3', {
          'justify-end': message.role === 'user' && mode !== 'edit',
          'justify-start': message.role === 'assistant',
        })}
      >
        {message.role === 'assistant' && (
          <div className="-mt-1 flex size-8 shrink-0">
            <div className="w-5 h-5 bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-sm border border-red-700 rounded-sm">
              人
            </div>
          </div>
        )}

        <div
          className={cn('flex flex-col', {
            'gap-2 md:gap-4': message.parts?.some(
              (p) => p.type === 'text' && p.text?.trim(),
            ),
            'min-h-96': message.role === 'assistant' && requiresScrollPadding,
            'w-full':
              (message.role === 'assistant' &&
                message.parts?.some(
                  (p) => p.type === 'text' && p.text?.trim(),
                )) ||
              mode === 'edit',
            'max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]':
              message.role === 'user' && mode !== 'edit',
          })}
        >
          {attachmentsFromMessage.length > 0 && (
            <div
              data-testid={`message-attachments`}
              className="flex flex-row justify-end gap-2"
            >
              {attachmentsFromMessage.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={{
                    name: attachment.filename ?? 'file',
                    contentType: attachment.mediaType,
                    url: attachment.url,
                  }}
                />
              ))}
            </div>
          )}

              {message.parts?.map((part, index) => {
                const { type } = part;
                const key = `message-${message.id}-part-${index}`;

            if (type === 'reasoning' && part.text?.trim().length > 0) {
              return (
                <MessageReasoning
                  key={key}
                  isLoading={isLoading}
                  reasoning={part.text}
                />
              );
            }

            if (type === 'text') {
              if (mode === 'view') {
                // Check if this message has citations from web search tools (not job search)
                const webSearchParts = message.parts?.filter(p =>
                  p.type.startsWith('tool-') &&
                  (p.type === 'tool-webSearchTool' || p.type === 'tool-newsSearchTool') &&
                  p.state === 'output-available' &&
                  'output' in p &&
                  p.output &&
                  !('error' in p.output)
                ) || [];

                const citations: CitationSource[] = webSearchParts
                  .flatMap(p => {
                    // Check if this is a tool invocation part with output
                    if ('output' in p && p.output) {
                      // Try to get citations from the output
                      if ((p.output as any).citations) {
                        return (p.output as any).citations;
                      }
                      // If no citations array, try to create them from results
                      if ((p.output as any).results && Array.isArray((p.output as any).results)) {
                        return (p.output as any).results.map((result: any, index: number) => ({
                          id: `result-${index}`,
                          title: result.title || 'Untitled',
                          url: result.link || result.url || '#',
                          domain: result.link ? new URL(result.link).hostname.replace('www.', '') : 'Unknown',
                          snippet: result.snippet,
                          logo: result.link ? `https://www.google.com/s2/favicons?domain=${new URL(result.link).hostname}&sz=32` : undefined
                        }));
                      }
                    }
                    return [];
                  }) || [];

                // Check if text becomes empty after sanitization
                const sanitizedText = sanitizeText(part.text);

                // For assistant messages, don't render if text is empty after sanitization
                // For user messages, always render something
                if (message.role === 'assistant' && (!sanitizedText || sanitizedText.trim().length === 0)) {
                  return null;
                }

                return (
                  <div key={key}>
                    <MessageContent
                      data-testid="message-content"
                      className={cn({
                        'w-fit break-words rounded-2xl px-3 py-2 text-right text-white':
                          message.role === 'user',
                        'bg-transparent px-0 py-0 text-left':
                          message.role === 'assistant',
                      })}
                      style={
                        message.role === 'user'
                          ? { backgroundColor: '#006cff' }
                          : undefined
                      }
                    >
                      <Response>
                        {sanitizedText || part.text || ''}
                      </Response>
                      {citations.length > 0 && /\[\d+\]/.test(sanitizedText || '') && (
                        <div className="mt-2">
                          <CitedText text={sanitizedText} citations={citations} />
                        </div>
                      )}
                    </MessageContent>
                  </div>
                );
              }

              if (mode === 'edit') {
                return (
                  <div
                    key={key}
                    className="flex w-full flex-row items-start gap-3"
                  >
                    <div className="size-8" />
                    <div className="min-w-0 flex-1">
                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        regenerate={regenerate}
                      />
                    </div>
                  </div>
                );
              }
            }

            if (type === 'tool-getWeather') {
              const { toolCallId, state } = part;

              return (
                <Tool key={toolCallId} defaultOpen={true}>
                  <ToolHeader type="tool-getWeather" state={state} />
                  <ToolContent>
                    {state === 'input-available' && (
                      <ToolInput input={part.input} />
                    )}
                    {state === 'output-available' && (
                      <ToolOutput
                        output={<Weather weatherAtLocation={part.output} />}
                        errorText={undefined}
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }

            if (type === 'tool-createDocument') {
              const { toolCallId } = part;

              if (part.output && 'error' in part.output) {
                return (
                  <div
                    key={toolCallId}
                    className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-500 dark:bg-red-950/50"
                  >
                    Error creating document: {String(part.output.error)}
                  </div>
                );
              }

              return (
                <DocumentPreview
                  key={toolCallId}
                  isReadonly={isReadonly}
                  result={part.output}
                />
              );
            }

            if (type === 'tool-updateDocument') {
              const { toolCallId } = part;

              if (part.output && 'error' in part.output) {
                return (
                  <div
                    key={toolCallId}
                    className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-500 dark:bg-red-950/50"
                  >
                    Error updating document: {String(part.output.error)}
                  </div>
                );
              }

              return (
                <div key={toolCallId} className="relative">
                  <DocumentPreview
                    isReadonly={isReadonly}
                    result={part.output}
                    args={{ ...part.output, isUpdate: true }}
                  />
                </div>
              );
            }

            if (type === 'tool-requestSuggestions') {
              const { toolCallId, state } = part;

              return (
                <Tool key={toolCallId} defaultOpen={true}>
                  <ToolHeader type="tool-requestSuggestions" state={state} />
                  <ToolContent>
                    {state === 'input-available' && (
                      <ToolInput input={part.input} />
                    )}
                    {state === 'output-available' && (
                      <ToolOutput
                        output={
                          'error' in part.output ? (
                            <div className="rounded border p-2 text-red-500">
                              Error: {String(part.output.error)}
                            </div>
                          ) : (
                            <DocumentToolResult
                              type="request-suggestions"
                              result={part.output}
                              isReadonly={isReadonly}
                            />
                          )
                        }
                        errorText={undefined}
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }

    // Web Search Tool Results
    if (type === 'tool-webSearchTool' || type === 'tool-newsSearchTool' || type === 'tool-jobSearchTool') {
      const { toolCallId, state } = part;

      return (
        <Tool key={toolCallId} defaultOpen={false}>
          <ToolHeader type={type} state={state} />
          <ToolContent>
            {state === 'input-available' && (
              <ToolInput input={part.input} />
            )}
            {state === 'output-available' && (
              <ToolOutput
                output={
                  'error' in part.output ? (
                    <div className="rounded border p-2 text-red-500">
                      Error: {String(part.output.error)}
                    </div>
                  ) : type === 'tool-jobSearchTool' ? (
                    <div className="text-sm text-muted-foreground">
                      <div className="font-medium mb-2">⚡ Recent Job Search:</div>
                      <div className="space-y-1">
                        <div>• <span className="font-medium">{part.output.results?.length || 0}</span> opportunities found</div>
                        <div>• <span className="font-medium">Query:</span> {part.output.query}</div>
                        {part.output.location && (
                          <div>• <span className="font-medium">Location:</span> {part.output.location}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Found {part.output.results?.length || 0} results for "{part.output.query}"
                    </div>
                  )
                }
                errorText={undefined}
              />
            )}
          </ToolContent>
        </Tool>
      );
    }

          })}

              {/* Add sources and jobs sections for assistant messages - only once per message */}
              {message.role === 'assistant' && mode === 'view' && (() => {
                // Collect all citations from web search tools
                const allCitations = message.parts
                  ?.filter(p => 
                    p.type.startsWith('tool-') && 
                    (p.type === 'tool-webSearchTool' || p.type === 'tool-newsSearchTool') &&
                    p.state === 'output-available' &&
                    p.output && 
                    !('error' in p.output)
                  )
                  .flatMap(p => {
                    // Check if this is a tool invocation part with output
                    if ('output' in p && p.output) {
                      if ((p.output as any).citations) {
                        return (p.output as any).citations;
                      }
                      if ((p.output as any).results && Array.isArray((p.output as any).results)) {
                        return (p.output as any).results.map((result: any, index: number) => ({
                        id: `result-${index}`,
                        title: result.title || 'Untitled',
                        url: result.link || result.url || '#',
                        domain: result.link ? new URL(result.link).hostname.replace('www.', '') : 'Unknown',
                          snippet: result.snippet,
                          logo: result.link ? `https://www.google.com/s2/favicons?domain=${new URL(result.link).hostname}&sz=32` : undefined
                        }));
                      }
                    }
                    return [];
                  }) || [];

                // Collect job results from job search tool
                const jobResults = message.parts
                  ?.filter(p => 
                    p.type === 'tool-jobSearchTool' &&
                    p.state === 'output-available' &&
                    p.output && 
                    !('error' in p.output)
                  )
                  .flatMap(p => {
                    // Check if this is a tool invocation part with output
                    if ('output' in p && p.output && (p.output as any).results && Array.isArray((p.output as any).results)) {
                      return (p.output as any).results.map((result: any) => ({
                        title: result.title || 'Untitled',
                        link: result.link || '#',
                        snippet: result.snippet || '',
                        date: result.date,
                        source: result.source || 'Unknown',
                        company: result.company || null,
                        companyLogo: result.company && p.output.companyLogos ? p.output.companyLogos[result.company] : null
                      }));
                    }
                    return [];
                  }) || [];

                return (
                  <>
                    {allCitations.length > 0 && (
                      <SourcesSection sources={allCitations} />
                    )}
                    {jobResults.length > 0 && (
                      <JobsSection jobs={jobResults} />
                    )}
                  </>
                );
              })()}

          {!isReadonly && (
            <MessageActions
              key={`action-${message.id}`}
              chatId={chatId}
              message={message}
              vote={vote}
              isLoading={isLoading}
              setMode={setMode}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return false;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="group/message w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-role={role}
    >
      <div className="flex items-start justify-start gap-3">
        <div className="-mt-1 flex size-8 shrink-0">
          <div className="w-5 h-5 bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-sm border border-red-700 rounded-sm">
            人
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 md:gap-4">
          <div className="p-0 text-muted-foreground text-sm">
            <LoadingText>Thinking...</LoadingText>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingText = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      animate={{ backgroundPosition: ['100% 50%', '-100% 50%'] }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      }}
      style={{
        background:
          'linear-gradient(90deg, hsl(var(--muted-foreground)) 0%, hsl(var(--muted-foreground)) 35%, hsl(var(--foreground)) 50%, hsl(var(--muted-foreground)) 65%, hsl(var(--muted-foreground)) 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      }}
      className="flex items-center text-transparent"
    >
      {children}
    </motion.div>
  );
};
