import { router } from '@inertiajs/react';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CloudAlert,
  Copy,
  RotateCcw,
  TicketX,
} from 'lucide-react';
import * as React from 'react';
import { type ZodError, ZodIssueCode } from 'zod';
import {
  fromZodError,
  isValidationErrorLike,
  isZodErrorLike,
  type ValidationError,
} from 'zod-validation-error';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useCopyToClipboardWithStatus } from '@/hooks/useCopyToClipboardWithStatus';
import { isHTTPError } from '@/lib/errors';
import { cn } from '@/lib/utils';

type ErrorType = 'api' | 'validation' | 'generic';

type ErrorDetails = {
  type: ErrorType;
  message: string;
  details?: string | React.ReactNode;
  code?: number;
};

type ZodErrorDisplayProps = React.ComponentProps<'div'> & {
  error: ZodError | ValidationError;
};
function ZodErrorDisplay({
  error,
  className,
  ref,
  ...props
}: ZodErrorDisplayProps) {
  const { copy, isCopied } = useCopyToClipboardWithStatus();

  const errors = isValidationErrorLike(error)
    ? error.details
    : fromZodError(error).details;

  if (!errors.length) return null;

  if (import.meta.env.PROD) {
    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        <div className="text-sm">
          <span className="font-semibold">Something went wrong.</span> Please
          check your input.
        </div>
        <Button
          onClick={() => copy(JSON.stringify(error, null, 2))}
          className="mt-2 rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800 hover:bg-gray-300"
        >
          <Copy className="mr-1 inline-block size-3" />
          {isCopied ? 'Copied!' : 'Copy Error Details'}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {errors.map((err, index) => (
        <Alert
          variant="default"
          key={err.path.join('.') + index}
          className="bg-yellow-200 text-yellow-800 duration-300 animate-in fade-in-50 slide-in-from-top-5"
        >
          <AlertCircle className="size-4 text-yellow-800" />
          <AlertTitle className="flex items-center gap-2 font-medium">
            Validation Error
            <Badge
              variant="default"
              className="ml-2 bg-yellow-600 font-mono text-xs font-normal hover:bg-yellow-500"
            >
              {err.code}
            </Badge>
          </AlertTitle>
          <AlertDescription className="mt-2">
            <div className="text-sm">
              <span className="font-semibold">
                {err.path.join('.') || 'Unknown field'}:
              </span>{' '}
              {err.message}
            </div>

            {/* Dynamically Show Extra Info Based on Error Type */}
            <div className="mt-2 grid gap-2 text-xs">
              {err.code === ZodIssueCode.invalid_type && (
                <>
                  {'expected' in err && (
                    <div className="rounded-md bg-destructive/10 p-1.5">
                      <span className="font-semibold">Expected:</span>{' '}
                      {err.expected}
                    </div>
                  )}
                  {'received' in err && (
                    <div className="rounded-md bg-destructive/10 p-1.5">
                      <span className="font-semibold">Received:</span>{' '}
                      {err.received}
                    </div>
                  )}
                </>
              )}

              {err.code === ZodIssueCode.invalid_enum_value && (
                <div className="rounded-md bg-destructive/10 p-1.5">
                  <span className="font-semibold">Allowed values:</span>{' '}
                  {JSON.stringify(err.options)}
                </div>
              )}

              {err.code === ZodIssueCode.too_small && (
                <div className="rounded-md bg-destructive/10 p-1.5">
                  <span className="font-semibold">Minimum:</span> {err.minimum}
                </div>
              )}

              {err.code === ZodIssueCode.too_big && (
                <div className="rounded-md bg-destructive/10 p-1.5">
                  <span className="font-semibold">Maximum:</span> {err.maximum}
                </div>
              )}

              {err.code === ZodIssueCode.not_multiple_of && (
                <div className="rounded-md bg-destructive/10 p-1.5">
                  <span className="font-semibold">Must be a multiple of:</span>{' '}
                  {err.multipleOf}
                </div>
              )}

              {err.code === ZodIssueCode.invalid_date && (
                <div className="rounded-md bg-destructive/10 p-1.5">
                  <span className="font-semibold">Hint:</span> Must be a valid
                  date format.
                </div>
              )}

              {err.code === ZodIssueCode.unrecognized_keys && (
                <div className="rounded-md bg-destructive/10 p-1.5">
                  <span className="font-semibold">Extra keys:</span>{' '}
                  {JSON.stringify(err.keys)}
                </div>
              )}

              {err.code === ZodIssueCode.custom && (
                <div className="rounded-md bg-destructive/10 p-1.5">
                  <span className="font-semibold">Note:</span> This is a custom
                  validation error.
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

function getErrorDetails(error: unknown): ErrorDetails {
  if (isHTTPError(error)) {
    const details =
      typeof error.details === 'string' ? error.details : error.stack;

    return {
      type: 'api',
      message: error.message,
      code: error.status,
      details: (
        <div>
          <p className="whitespace-pre-wrap font-mono">
            <span>{error.method}</span> <span>{error.route}</span>
          </p>
          <div className="mt-2 rounded border border-border/50 bg-red-200 px-2.5 py-1.5 text-xs">
            <pre className="whitespace-pre-wrap">{details}</pre>
          </div>
        </div>
      ),
    };
  } else if (isZodErrorLike(error) || isValidationErrorLike(error)) {
    if (import.meta.env.PROD) {
      return {
        type: 'validation',
        message: 'Validation Error',
        details: ZodErrorDisplay({ error }),
      };
    }

    return {
      type: 'validation',
      message:
        error.message.split(':').at(1)?.split(';').at(0) || 'Validation Error',
      details: ZodErrorDisplay({ error }),
    };
  } else if (error instanceof Error) {
    return {
      type: 'generic',
      message: error.message,
      details: error.stack,
    };
  } else {
    return {
      type: 'generic',
      message: 'An unknown error occurred',
      details: String(error),
    };
  }
}

function getErrorStyles(type: ErrorType): {
  bg: string;
  border: string;
  text: string;
  details: string;
  button: string;
} {
  switch (type) {
    case 'api':
      return {
        bg: 'bg-red-100',
        border: 'border-red-300',
        text: 'text-red-700',
        details:
          'text-red-700 font-mono hover:text-red-600 hover:bg-transparent',
        button: 'bg-red-200 text-red-800 hover:bg-red-100',
      };
    case 'validation':
      return {
        bg: 'bg-yellow-100',
        border: 'border-yellow-300',
        text: 'text-yellow-700',
        details:
          'text-yellow-700 font-mono hover:text-yellow-600 hover:bg-transparent',
        button: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-100',
      };
    case 'generic':
    default:
      return {
        bg: 'bg-fuchsia-100',
        border: 'border-fuchsia-100',
        text: 'text-fuchsia-700',
        details:
          'text-fuchsia-700 font-mono hover:text-fuchsia-600 hover:bg-transparent',
        button: 'bg-fuchsia-200 text-fuchsia-800 hover:bg-fuchsia-100',
      };
  }
}

type ErrorProps = {
  error: unknown;
  onRetry?: () => void;
  children?: React.ReactNode;
  render?: (props: {
    errorDetails: ErrorDetails;
    isExpanded: boolean;
    toggleExpanded: () => void;
    retry: () => void;
  }) => React.ReactNode;
};

export function ErrorDisplay({ error, onRetry, children, render }: ErrorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const errorDetails = getErrorDetails(error);
  const { bg, border, text, details, button } = getErrorStyles(
    errorDetails.type,
  );

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  if (render) {
    return (
      <>
        {render({
          errorDetails,
          isExpanded,
          toggleExpanded,
          retry: onRetry || (() => {}),
        })}
      </>
    );
  }

  return (
    <Card
      className={cn(
        'mx-auto w-full max-w-2xl border-2 font-mono shadow-lg',
        border,
        bg,
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        {errorDetails.type === 'api' ? (
          <CloudAlert className={cn('size-6', text)} />
        ) : errorDetails.type === 'validation' ? (
          <TicketX className={cn('size-6', text)} />
        ) : (
          <AlertCircle className={cn('size-6', text)} />
        )}
        <CardTitle className={cn('text-lg font-semibold', text)}>
          {errorDetails.type === 'api'
            ? 'API Error'
            : errorDetails.type === 'validation'
              ? 'Validation Error'
              : 'Error'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <pre
          className={cn(
            'truncate font-mono text-sm font-medium leading-8 first-line:font-semibold first-line:uppercase first-line:tracking-wider',
            text,
          )}
        >
          {errorDetails.message}
        </pre>
        {errorDetails.code && (
          <p className={cn('truncate text-xs', text)}>
            Error Code: {errorDetails.code}
          </p>
        )}
        {errorDetails.details && (
          <Collapsible
            open={isExpanded}
            onOpenChange={setIsExpanded}
            className="w-full space-y-2"
          >
            <div className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className={cn('', details)}>
                  {isExpanded ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                  <span className="">
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={cn('mt-2 rounded p-2 text-xs', bg, text)}>
                  {typeof errorDetails.details === 'string' ? (
                    <pre className="truncate whitespace-pre-wrap">
                      {errorDetails.details}
                    </pre>
                  ) : (
                    errorDetails.details
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}
        {children}
      </CardContent>
      {onRetry && (
        <CardFooter>
          <Button
            variant="default"
            size="sm"
            className={cn('w-full', button)}
            onClick={onRetry}
          >
            <RotateCcw className="mr-2 size-4" />
            Retry
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function ErrorComponent({ error }: { error: unknown }) {
  return (
    <div className="grid h-full place-items-center">
      <ErrorDisplay error={error} onRetry={() => router.reload()} />
    </div>
  );
}
