# Forms Components

This directory contains custom form components that integrate React Hook Form with shadcn/ui styling.

## Components

- **Form**: Wrapper around React Hook Form's `FormProvider`
- **FormField**: Controller component for form fields
- **FormItem**: Container for form field items
- **FormLabel**: Label component with error state styling
- **FormControl**: Control wrapper with accessibility attributes
- **FormDescription**: Description text for form fields
- **FormMessage**: Error message display component

## Usage

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/forms';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

## Dependencies

- `react-hook-form`: Form state management
- `@radix-ui/react-label`: Accessible label component
- `@radix-ui/react-slot`: Polymorphic component utility
- `@/components/ui/label`: shadcn/ui label component
- `@/lib/utils`: Utility functions (cn helper)

## Note

This is a custom component that combines React Hook Form with shadcn/ui styling. It's not a standard shadcn/ui component, which is why it's located in `/components/forms/` rather than `/components/ui/`.
