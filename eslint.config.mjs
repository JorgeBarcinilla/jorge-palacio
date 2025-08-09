// @ts-check
import eslint from "@eslint/js";
import rxjs from "@smarttools/eslint-plugin-rxjs";
import angular from "angular-eslint";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
      },
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettier,
      jsdoc.configs["flat/recommended"],
      perfectionist.configs["recommended-natural"],
      rxjs.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    plugins: {
      prettier: prettierPlugin,
      rxjs,
      jsdoc,
    },
    processor: angular.processInlineTemplates,
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "prefer-arrow-callback": "warn",

      // Angular
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],

      // Prettier
      "prettier/prettier": "error",

      // JSDoc
      "jsdoc/require-description": "warn",
      "jsdoc/require-hyphen-before-param-description": "warn",
      "jsdoc/require-throws": "warn",
      "jsdoc/check-syntax": "warn",
      "jsdoc/no-defaults": "warn",
      "jsdoc/no-undefined-types": ["warn", { definedTypes: ["T", "K", "T.K"] }],
      "jsdoc/require-jsdoc": [
        "error",
        {
          contexts: [
            "FunctionDeclaration",
            "FunctionExpression",
            "ClassDeclaration",
            // Métodos de clase excepto los lifecycle de Angular
            "MethodDefinition[kind='method']:not([key.name=/^ng(?:OnInit|OnDestroy|OnChanges|AfterViewInit|AfterViewChecked|AfterContentInit|AfterContentChecked|AfterRender|AfterNextRender)$/])",
          ],
          checkConstructors: false,
        },
      ],

      // RxJS
      "rxjs/throw-error": "error",
      "rxjs/no-unsafe-catch": [
        "error",
        { observable: "[Aa]ction(s|s\\$|\\$)$" },
      ],
      "rxjs/no-implicit-any-catch": "off",
      "rxjs/finnish": [
        "error",
        {
          functions: true,
          methods: true,
          names: {
            "^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate|store)$": false,
          },
          parameters: true,
          properties: true,
          strict: false,
          types: { "^EventEmitter$": false },
          variables: true,
        },
      ],

      // TS rules (el plugin ya viene con tseslint.configs.recommended)
      "@typescript-eslint/no-empty-interface": [
        "error",
        { allowSingleExtends: false },
      ],
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/member-ordering": [
        "error",
        {
          default: [
            "static-field",
            "instance-field",
            "static-method",
            "instance-method",
          ],
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["property"],
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "require",
        },
      ],

      // import plugin
      "no-unused-vars": "off",
      "import/no-dynamic-require": "warn",
      "import/no-nodejs-modules": "warn",
      "import/no-unresolved": [0, { ignore: ["src/.*$"] }],
    },
    settings: {
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
      jsdoc: { mode: "typescript" },
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettier,
      //...tailwind.configs["flat/recommended"],
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": ["error", { parser: "angular" }],
      "@angular-eslint/template/use-track-by-function": "error",
      "@angular-eslint/template/no-duplicate-attributes": "error",
      "@angular-eslint/template/valid-aria": "error",
      "@angular-eslint/template/no-interpolation-in-attributes": "error",
      "@angular-eslint/template/no-negated-async": "error",
      "@angular-eslint/template/no-distracting-elements": "error",
      "@angular-eslint/template/no-call-expression": [
        "error",
        { allowList: ["prepareRoute"] },
      ],
      "@angular-eslint/template/no-any": "error",
      "@angular-eslint/template/eqeqeq": "error",
      "@angular-eslint/template/conditional-complexity": [
        "error",
        { maxComplexity: 3 },
      ],
    },
    /*"settings": {
        "tailwindcss": {
          "mode": "v4",                 // <- clave para que use la API v4
          "config": "./src/styles.css",
          "officialSorting": true,
          "prependCustom": false,
          "whitelist": []
        }
      }*/
  },
);
