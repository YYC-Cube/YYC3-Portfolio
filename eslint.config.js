import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'out', '.next'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // shadcn/ui 组件、Next.js layout 和 i18n Provider 遵循框架标准模式，
  // 允许在同一文件中导出组件和非组件值
  {
    files: [
      'app/layout.tsx',
      'components/ui/**/*.{ts,tsx}',
      'components/Pagination.tsx',
      'lib/i18n/provider.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
)