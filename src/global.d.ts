// Minimal JSX shims for this project.
// React types are not installed via @types/react; this narrows the gaps we hit.

import 'react';

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      key?: string | number | null | undefined;
    }
  }
}
