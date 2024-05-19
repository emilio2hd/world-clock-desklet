/* eslint-disable max-lines, no-magic-numbers */
const js = require('@eslint/js');
const jsdoc = require('eslint-plugin-jsdoc');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  jsdoc.configs['flat/recommended'],
  {
    plugins: {
      jsdoc: jsdoc,
    },
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.builtin,
        ...globals.commonjs,
        ARGV: 'readonly',
        Debugger: 'readonly',
        GIRepositoryGType: 'readonly',
        imports: 'readonly',
        log: 'readonly',
        logError: 'readonly',
        pkg: 'readonly',
        print: 'readonly',
        printerr: 'readonly',
        window: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      // See: https://eslint.org/docs/latest/rules
      // See: https://gjs.guide/guides/gjs/style-guide.html#eslint
      // See: https://eslint.org/docs/latest/rules/#possible-problems
      'array-callback-return': 'error',
      curly: 'error',
      'default-case-last': 'error',
      'jsdoc/require-param-description': 0,
      'jsdoc/require-returns-description': 0,
      indent: ['error', 2],
      'no-await-in-loop': 'error',
      'no-constant-binary-expression': 'error',
      'no-constructor-return': 'error',
      'no-else-return': 'warn',
      'no-eval': 'error',
      'no-magic-numbers': 'error',
      'no-nested-ternary': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-promise-executor-return': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-private-class-members': 'error',
      'no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: true,
          allowNamedExports: true,
        },
      ],
      'prefer-const': 'error',
      'prefer-destructuring': 'warn',
      yoda: 'warn',
      // See: https://eslint.org/docs/latest/rules/#suggestions
      'block-scoped-var': 'error',
      complexity: 'warn',
      'consistent-return': 'error',
      'default-param-last': 'error',
      eqeqeq: 'error',
      'grouped-accessor-pairs': 'error',
      'max-lines': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
      'no-array-constructor': 'error',
      'no-caller': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-loop-func': 'error',
      'no-multi-assign': 'warn',
      'no-new-object': 'error',
      'no-new-wrappers': 'error',
      'no-proto': 'error',
      'no-shadow': 'warn',
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'no-var': 'warn',
      'unicode-bom': 'error',
      // GJS Restrictions
      'no-restricted-globals': [
        'error',
        {
          name: 'Debugger',
          message: 'Internal use only',
        },
        {
          name: 'GIRepositoryGType',
          message: 'Internal use only',
        },
        {
          name: 'log',
          message: 'Use console.log()',
        },
        {
          name: 'logError',
          message: 'Use console.warn() or console.error()',
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'imports',
          property: 'format',
          message: 'Use template strings',
        },
        {
          object: 'pkg',
          property: 'initFormat',
          message: 'Use template strings',
        },
        {
          object: 'Lang',
          property: 'copyProperties',
          message: 'Use Object.assign()',
        },
        {
          object: 'Lang',
          property: 'bind',
          message: 'Use arrow notation or Function.prototype.bind()',
        },
        {
          object: 'Lang',
          property: 'Class',
          message: 'Use ES6 classes',
        },
      ],
      // Most of cinammon desklets use _init(), that's why this rule is commented
      // "no-restricted-syntax": [
      //   "error",
      //   {
      //     selector:
      //       'MethodDefinition[key.name="_init"] CallExpression[arguments.length<=1][callee.object.type="Super"][callee.property.name="_init"]',
      //     message: "Use constructor() and super()",
      //   },
      // ],
    },
  },
  eslintConfigPrettier,
];
