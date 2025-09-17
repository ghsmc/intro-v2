import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
  isRegistration = false,
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
  isRegistration?: boolean;
}) {
  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      {isRegistration && (
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="name"
            className="font-normal text-zinc-600 dark:text-zinc-400"
          >
            Full Name
          </Label>

          <Input
            id="name"
            name="name"
            className="bg-muted text-md md:text-sm"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            required
            autoFocus
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="font-normal text-zinc-600 dark:text-zinc-400"
        >
          Email Address
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus={!isRegistration}
          defaultValue={defaultEmail}
        />
      </div>

      {isRegistration && (
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="major"
            className="font-normal text-zinc-600 dark:text-zinc-400"
          >
            Major
          </Label>

          <Input
            id="major"
            name="major"
            className="bg-muted text-md md:text-sm"
            type="text"
            placeholder="Computer Science"
            autoComplete="organization-title"
            required
          />
        </div>
      )}

      {isRegistration && (
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="classYear"
            className="font-normal text-zinc-600 dark:text-zinc-400"
          >
            Class Year
          </Label>

          <Input
            id="classYear"
            name="classYear"
            className="bg-muted text-md md:text-sm"
            type="text"
            placeholder="2025"
            autoComplete="off"
            required
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="font-normal text-zinc-600 dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
        />
      </div>

      {children}
    </Form>
  );
}
