'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { ToolUIPart } from 'ai';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { CodeBlock } from './code-block';

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn('not-prose mb-4 w-full rounded-md border', className)}
    {...props}
  />
);

export type ToolHeaderProps = {
  type: ToolUIPart['type'];
  state: ToolUIPart['state'];
  className?: string;
};

const getStatusBadge = (status: ToolUIPart['state'], type?: ToolUIPart['type']) => {
  // Sleek loading statements for job search tool
  const getJobSearchLabel = (status: ToolUIPart['state']) => {
    const jobSearchLabels = {
      'input-streaming': 'Analyzing query',
      'input-available': 'Searching job database',
      'output-available': 'Complete',
      'output-error': 'Failed',
    } as const;
    return jobSearchLabels[status];
  };

  const getWebSearchLabel = (status: ToolUIPart['state']) => {
    const webSearchLabels = {
      'input-streaming': 'Initializing',
      'input-available': 'Searching web',
      'output-available': 'Complete',
      'output-error': 'Failed',
    } as const;
    return webSearchLabels[status];
  };

  const getNewsSearchLabel = (status: ToolUIPart['state']) => {
    const newsSearchLabels = {
      'input-streaming': 'Initializing',
      'input-available': 'Fetching news',
      'output-available': 'Complete',
      'output-error': 'Failed',
    } as const;
    return newsSearchLabels[status];
  };

  const getBulgeBracketLabel = (status: ToolUIPart['state']) => {
    const bulgeBracketLabels = {
      'input-streaming': 'Preparing search',
      'input-available': 'Searching IB programs',
      'output-available': 'Complete',
      'output-error': 'Failed',
    } as const;
    return bulgeBracketLabels[status];
  };

  const getDefaultLabel = (status: ToolUIPart['state']) => {
    const defaultLabels = {
      'input-streaming': 'Pending',
      'input-available': 'Running',
      'output-available': 'Completed',
      'output-error': 'Error',
    } as const;
    return defaultLabels[status];
  };

  // Get the appropriate label based on tool type
  const getLabel = () => {
    if (type === 'tool-jobSearchTool') return getJobSearchLabel(status);
    if (type === 'tool-webSearchTool') return getWebSearchLabel(status);
    if (type === 'tool-newsSearchTool') return getNewsSearchLabel(status);
    if (type === 'tool-bulgeBracketSearchTool') return getBulgeBracketLabel(status);
    return getDefaultLabel(status);
  };

  const icons = {
    'input-streaming': <CircleIcon className="size-4" />,
    'input-available': <ClockIcon className="size-4 animate-pulse" />,
    'output-available': <CheckCircleIcon className="size-4 text-green-600" />,
    'output-error': <XCircleIcon className="size-4 text-red-600" />,
  } as const;

  return (
    <div className='flex items-center gap-1.5 font-mono text-muted-foreground text-xs'>
      {status === 'input-available' && (
        <div className='size-2 animate-pulse rounded-full bg-blue-500' />
      )}
      {status === 'output-available' && (
        <div className="size-2 rounded-full bg-green-500" />
      )}
      {status === 'output-error' && (
        <div className="size-2 rounded-full bg-red-500" />
      )}
      {status === 'input-streaming' && (
        <div className="size-2 rounded-full bg-gray-400" />
      )}
      <span className="uppercase tracking-wider">{getLabel()}</span>
    </div>
  );
};

export const ToolHeader = ({
  className,
  type,
  state,
  ...props
}: ToolHeaderProps) => {
  const getToolName = (toolType: string) => {
    const toolNames: Record<string, string> = {
      'tool-jobSearchTool': 'Job Search',
      'tool-webSearchTool': 'Web Search',
      'tool-newsSearchTool': 'News Search',
      'tool-bulgeBracketSearchTool': 'IB Programs Search',
      'tool-requestSuggestions': 'Suggestions',
      'tool-updateDocument': 'Document Update',
      'tool-createDocument': 'Document Creation',
    };
    return toolNames[toolType] || toolType.replace('tool-', '');
  };

  return (
    <CollapsibleTrigger
      className={cn(
        'flex w-full min-w-0 items-center justify-between gap-2 p-3',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <WrenchIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate font-medium text-sm">{getToolName(type)}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {getStatusBadge(state, type)}
        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </div>
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in',
      className,
    )}
    {...props}
  />
);

export type ToolInputProps = ComponentProps<'div'> & {
  input: ToolUIPart['input'];
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => (
  <div className={cn('space-y-2 overflow-hidden p-4', className)} {...props}>
    <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
      Parameters
    </h4>
    <div className="rounded-md bg-muted/50">
      <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
    </div>
  </div>
);

export type ToolOutputProps = ComponentProps<'div'> & {
  output: ReactNode;
  errorText: ToolUIPart['errorText'];
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  return (
    <div className={cn('space-y-2 p-4', className)} {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {errorText ? 'Error' : 'Result'}
      </h4>
      <div
        className={cn(
          'overflow-x-auto rounded-md text-xs [&_table]:w-full',
          errorText
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted/50 text-foreground',
        )}
      >
        {errorText && <div>{errorText}</div>}
        {output && <div>{output}</div>}
      </div>
    </div>
  );
};
