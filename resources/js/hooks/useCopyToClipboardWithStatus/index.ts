import { useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import { useToast } from '@/hooks/use-toast';

const DEFAULT_TOAST_OPTIONS = {
  title: 'Copied to clipboard',
  description: 'Text copied to clipboard',
  duration: 2_000,
} satisfies Parameters<ReturnType<typeof useToast>['toast']>[0];

/**
 * Copy text to clipboard and set a temporary state when the copy is
 * successful. This is useful for displaying a "Copied!" message to the user.
 *
 * @returns An object with the following properties:
 *   * `isCopied`: A boolean indicating whether the text was copied.
 *   * `copiedText`: The text that was copied, or an empty string if nothing
 *     was copied.
 *   * `copy`: A function that takes a string and attempts to copy it to the
 *     clipboard. If the copy is successful, `isCopied` is set to `true` for
 *     1.5 seconds.
 *
 * @see https://usehooks-ts.com/react-hook/use-copy-to-clipboard
 *
 * @example
 * const { isCopied, copiedText, copy } = useCopyToClipboardWithStatus();
 * return (
 *   <button onClick={() => copy('Hello, world!')}>
 *     {isCopied ? 'Copied!' : 'Copy'}
 *   </button>
 * );
 */
export function useCopyToClipboardWithStatus() {
  const { toast } = useToast();
  const [copiedText, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const copyWithFeedback = async (
    text: string,
    toastOptions: Parameters<typeof toast>[0] = DEFAULT_TOAST_OPTIONS,
  ) => {
    try {
      await copy(text); // Call the original copy function
      setIsCopied(true);
      toast({
        ...DEFAULT_TOAST_OPTIONS,
        ...toastOptions,
      });

      setTimeout(() => setIsCopied(false), 1_500); // Reset after 1.5 seconds
    } catch (error) {
      console.error('Failed to copy!', error);
      setIsCopied(false);
    }
  };

  return { isCopied, copiedText, copy: copyWithFeedback };
}
