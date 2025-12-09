import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    'node_modules/**',
    'public/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/components/ui/*.*',
  ]),
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'no-console': 'error',
      'max-params': [
        'error',
        {
          max: 3,
        },
      ],
      'id-length': [
        'error',
        {
          min: 2,
          max: 50,
          exceptions: ['_'],
          properties: 'always',
        },
      ],
    },
  },
]);

export default eslintConfig;
