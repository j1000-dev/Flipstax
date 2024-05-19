module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true,
        browser: true
    },
    extends: 'eslint:recommended',
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4, {SwitchCase: 1}],
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
        quotes: ['error', 'single', 'avoid-escape'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {vars: 'all', args: 'after-used', ignoreRestSiblings: false}
        ],
        '@typescript-eslint/explicit-function-return-type': 'warn',
        'no-empty': 'warn'
    }
};
