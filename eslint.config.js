import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default ts.config(
	{ ignores: ['eslint.config.js'] },
	ts.configs.base,
	svelte.configs.base,
	{
		languageOptions: { parserOptions: { projectService: true } },
		rules: { '@typescript-eslint/no-deprecated': 'error' }
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: { parser: ts.parser, extraFileExtensions: ['.svelte'] }
		}
	}
);
