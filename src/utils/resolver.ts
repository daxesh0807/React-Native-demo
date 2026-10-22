import { z } from 'zod';
import { Resolver, FieldValues, FieldErrors } from 'react-hook-form';

export function zodResolver<T extends FieldValues>(
  schema: z.ZodType<any, any, any>
): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data as T,
        errors: {},
      };
    }

    const errors: FieldErrors<T> = {};
    const issues = result.error.issues || (result.error as any).errors || [];

    for (const issue of issues) {
      const path = issue.path.join('.') as keyof T;
      if (!errors[path]) {
        (errors as any)[path] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }

    return {
      values: {},
      errors,
    };
  };
}

