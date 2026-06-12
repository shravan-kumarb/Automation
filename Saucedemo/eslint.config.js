//@ts-check
const tseslint = require('typescript-eslint');
const playwright = require('eslint-plugin-playwright');


module.exports = tseslint.config(
    {
    ignores:[
        'node_modules',
        'dist',
        'playwright-report',
        'allure-report',
        'allure-results',
        'test-rsults',
        'eslint.config.js',
    ],
},
...tseslint.configs.recommended,
{
    files:['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules:{
        ...playwright.configs['flat/recommended'].rules,
            'playwright/expect-expect':[
                'warn',
                {
                    assertFunctionNames: ['expectLoaded','expectError','expectSuccess']},
            ],
    },

},
{
    rules:{
        '@typescript-eslint/no-unused-vars':['warn',{argsIgnorePattern:'^_'}],
    },
},
);