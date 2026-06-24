import { Loader2, Mail, Phone, UserRound, X } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchCardCodeUsers } from '@/features/cards/api/card-codes.api';
import type { CardCodeAssignableUser } from '@/features/cards/schemas/card-code.schema';
import { cn } from '@/lib/utils';

type CardCodeUserSearchPickerProps = {
  selectedUser: CardCodeAssignableUser | null;
  onSelect: (user: CardCodeAssignableUser | null) => void;
  disabled?: boolean;
  highlightUserId?: number | null;
  emailInputId?: string;
  phoneInputId?: string;
};

export function CardCodeUserSearchPicker({
  selectedUser,
  onSelect,
  disabled = false,
  highlightUserId = null,
  emailInputId = 'card-code-user-email',
  phoneInputId = 'card-code-user-phone',
}: CardCodeUserSearchPickerProps) {
  const [searchMode, setSearchMode] = React.useState<'email' | 'phone'>('email');
  const [emailQuery, setEmailQuery] = React.useState('');
  const [phoneQuery, setPhoneQuery] = React.useState('');
  const [results, setResults] = React.useState<CardCodeAssignableUser[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = async () => {
    const email = searchMode === 'email' ? emailQuery.trim() : '';
    const phone = searchMode === 'phone' ? phoneQuery.trim() : '';

    if (!email && !phone) {
      toast.error(
        searchMode === 'email'
          ? 'Enter an email address to search'
          : 'Enter a phone number to search',
      );
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const users = await searchCardCodeUsers({ email, phone });
      setResults(users);
    } catch (error) {
      setResults([]);
      toast.error(
        error instanceof Error ? error.message : 'Unable to search users',
      );
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSearchMode('email');
    setEmailQuery('');
    setPhoneQuery('');
    setResults([]);
    setHasSearched(false);
    setIsSearching(false);
  };

  React.useEffect(() => {
    if (!selectedUser) {
      return;
    }

    resetSearch();
  }, [selectedUser]);

  return (
    <div className="space-y-4">
      {selectedUser ? (
        <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserRound className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">{selectedUser.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {selectedUser.email}
            </p>
            {selectedUser.phone ? (
              <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => onSelect(null)}
            disabled={disabled}
            aria-label="Clear selected customer"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <>
          <Tabs
            value={searchMode}
            onValueChange={(value) => {
              setSearchMode(value as 'email' | 'phone');
              setResults([]);
              setHasSearched(false);
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="gap-2" disabled={disabled}>
                <Mail className="size-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2" disabled={disabled}>
                <Phone className="size-4" />
                Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-2 pt-2">
              <Label htmlFor={emailInputId}>Customer email</Label>
              <div className="flex gap-2">
                <Input
                  id={emailInputId}
                  type="email"
                  placeholder="customer@example.com"
                  value={emailQuery}
                  onChange={(event) => setEmailQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void handleSearch();
                    }
                  }}
                  disabled={disabled || isSearching}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void handleSearch()}
                  disabled={disabled || isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-2 pt-2">
              <Label htmlFor={phoneInputId}>Customer phone</Label>
              <div className="flex gap-2">
                <Input
                  id={phoneInputId}
                  type="tel"
                  placeholder="+880..."
                  value={phoneQuery}
                  onChange={(event) => setPhoneQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void handleSearch();
                    }
                  }}
                  disabled={disabled || isSearching}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void handleSearch()}
                  disabled={disabled || isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

            <div className="space-y-2">
            <p className="text-sm font-medium">Search results</p>
            {results.length > 1 && searchMode === 'phone' ? (
              <p className="text-xs text-muted-foreground">
                Multiple customers share this phone number. Select the correct
                account by email below.
              </p>
            ) : null}
            {isSearching ? (
              <div className="flex items-center justify-center rounded-lg border py-8 text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Searching customers...
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-2">
                {results.map((user) => {
                  const isSelected = selectedUser?.id === user.id;

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => onSelect(user)}
                      disabled={disabled}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50',
                      )}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                        <UserRound className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{user.name}</p>
                          {highlightUserId === user.id ? (
                            <Badge variant="secondary">Current</Badge>
                          ) : null}
                        </div>
                        <p className="truncate text-sm font-medium text-foreground">
                          {user.email}
                        </p>
                        {user.phone ? (
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : hasSearched ? (
              <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                No customers found. Try the other search method.
              </div>
            ) : (
              <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                Search by email or phone to find a customer account.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
