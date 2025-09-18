/**
 * ESLint 配置文件 - Vue 3 + TypeScript 项目
 *
 * 此配置文件为绝地潜兵 2 随机战备生成器项目提供代码质量和风格检查。
 * 项目技术栈：Vue 3 + TypeScript + Vite
 *
 * 主要特性：
 * - 支持 Vue 3 组合式 API 和选项式 API
 * - TypeScript 严格类型检查
 * - 与 Prettier 兼容的代码格式化规则
 * - 浏览器环境全局变量支持
 */

import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import importPlugin from "eslint-plugin-import";

export default [
  // === 基础配置 ===
  // 使用 ESLint 推荐的 JavaScript 规则
  js.configs.recommended,

  // 使用 Vue 插件的推荐配置（适用于 Vue 3）
  ...vuePlugin.configs["flat/recommended"],

  // === Vue + TypeScript 文件配置 ===
  {
    // 匹配所有 JavaScript、TypeScript 和 Vue 文件
    files: ["**/*.{js,ts,vue}"],

    languageOptions: {
      // 使用 Vue 解析器作为主解析器
      parser: vueParser,
      parserOptions: {
        // Vue 文件中的 <script> 标签使用 TypeScript 解析器
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        // 支持解析 .vue 文件
        extraFileExtensions: [".vue"],
      },
      // 浏览器环境全局变量
      globals: {
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        HTMLElement: "readonly",
        URL: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      vue: vuePlugin,
      import: importPlugin,
    },

    // 导入解析器设置
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.app.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        },
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx", ".vue"],
      "import/external-module-folders": ["node_modules", "@types"],
    },

    rules: {
      // ==================== Vue 3 专用规则 ====================

      // Vue 3 组合式 API 规则（eslint-plugin-vue v10.4.0 支持的规则）
      "vue/no-ref-as-operand": "error", // 禁止将 ref 作为操作数
      "vue/no-watch-after-await": "error", // 禁止在 async setup 中的 await 后使用 watch

      // Vue 3 推荐的性能优化规则
      "vue/no-useless-v-bind": "error", // 移除无用的 v-bind
      "vue/no-unused-refs": "error", // 移除未使用的 template refs

      // ==================== Vue 通用规则 ====================

      // 组件命名（允许单词组件名，适用于页面级组件）
      "vue/multi-word-component-names": "off",

      // 未使用变量检查
      "vue/no-unused-vars": "error",

      // 模板格式化规则
      "vue/attribute-hyphenation": ["error", "always"], // 属性名使用短横线命名
      "vue/component-definition-name-casing": ["error", "PascalCase"], // 组件名使用 PascalCase
      "vue/html-indent": ["error", 2], // HTML 缩进 2 个空格
      "vue/html-quotes": ["error", "double"], // HTML 属性使用双引号
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: 3, // 单行最多 3 个属性
          multiline: 1,  // 多行每行 1 个属性
        },
      ],

      // 模板语法规则
      "vue/mustache-interpolation-spacing": ["error", "always"], // 插值表达式空格
      "vue/v-bind-style": ["error", "shorthand"], // 使用 : 简写
      "vue/v-on-style": ["error", "shorthand"], // 使用 @ 简写
      "vue/v-slot-style": ["error", "shorthand"], // 使用 # 简写

      // 组件 Props 规则
      "vue/require-default-prop": "off", // 不强制要求默认值（TypeScript 已处理）
      "vue/require-prop-types": "off", // 不强制要求 prop 类型（TypeScript 已处理）
      "vue/prop-name-casing": ["error", "camelCase"], // props 使用 camelCase

      // 模板可读性规则
      "vue/singleline-html-element-content-newline": "off", // 允许单行元素内容
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "never", // HTML void 元素不自闭合
            normal: "always", // 普通 HTML 元素自闭合
            component: "always", // Vue 组件自闭合
          },
          svg: "always",
          math: "always",
        },
      ],

      // ==================== TypeScript 规则 ====================

      // 未使用变量处理（支持下划线前缀忽略）
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // 忽略以 _ 开头的参数
          varsIgnorePattern: "^_", // 忽略以 _ 开头的变量
        },
      ],

      // TypeScript 类型规则
      "@typescript-eslint/no-explicit-any": "warn", // 警告使用 any 类型
      "@typescript-eslint/no-inferrable-types": "error", // 移除可推断的类型注解
      "@typescript-eslint/prefer-as-const": "error", // 优先使用 as const
      "@typescript-eslint/no-non-null-assertion": "warn", // 警告使用非空断言

      // ==================== 导入模块顺序规则 ====================
      // 基于 Vue 官方推荐的导入顺序

      // 强制导入顺序
      "import/order": [
        "error",
        {
          groups: [
            "builtin",        // Node.js 内置模块
            "external",       // 第三方库
            "internal",       // 内部路径（通过别名配置）
            "parent",         // 父级目录
            "sibling",        // 同级目录
            "index",          // 当前目录的 index 文件
            "type",           // TypeScript 类型导入
          ],
          pathGroups: [
            // Vue 核心模块优先级最高
            {
              pattern: "vue",
              group: "external",
              position: "before",
            },
            // Vue 生态系统
            {
              pattern: "vue-*",
              group: "external",
              position: "before",
            },
            // @vue 相关包
            {
              pattern: "@vue/**",
              group: "external",
              position: "before",
            },
            // 项目内部模块（@ 别名）
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
            // 组件导入
            {
              pattern: "@/components/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["type"],
          "newlines-between": "always", // 不同组之间需要空行
          alphabetize: {
            order: "asc", // 按字母顺序排列
            caseInsensitive: true, // 忽略大小写
          },
        },
      ],

      // 禁止重复导入
      "import/no-duplicates": "error",

      // 确保导入的模块存在
      "import/no-unresolved": "off", // 暂时关闭，因为 Vue 文件解析有问题

      // 优先使用默认导入
      "import/prefer-default-export": "off", // 关闭，因为 Vue 3 组合式 API 通常使用命名导入

      // 禁止导入不存在的命名导出
      "import/named": "off", // 暂时关闭，因为 Vue 文件解析有问题

      // 确保默认导入与模块的默认导出匹配
      "import/default": "off", // 暂时关闭，因为 Vue 文件解析有问题

      // 确保导入的命名空间存在
      "import/namespace": "off", // 暂时关闭，因为 Vue 文件解析有问题

      // 禁止使用相对路径导入父级目录的模块（强制使用别名）
      "import/no-relative-parent-imports": "off", // 关闭，允许相对导入

      // ==================== JavaScript 通用规则 ====================

      // 调试和开发规则
      "no-console": "warn", // 警告 console 语句
      "no-debugger": "error", // 禁止 debugger 语句

      // 变量声明规则
      "no-unused-vars": "off", // 关闭 JS 版本，使用 TypeScript 版本
      "prefer-const": "error", // 优先使用 const
      "no-var": "error", // 禁止使用 var

      // 现代 JavaScript 语法
      "object-shorthand": "error", // 对象属性简写
      "prefer-arrow-callback": "error", // 优先使用箭头函数回调
      "prefer-template": "error", // 优先使用模板字符串
      "prefer-rest-params": "error", // 优先使用 rest 参数

      // 代码质量规则
      "no-useless-escape": "error", // 禁止无用的转义
      "no-irregular-whitespace": "error", // 禁止不规则空白
      "no-prototype-builtins": "error", // 禁止直接调用原型方法
      "no-fallthrough": "error", // 禁止 switch 穿透

      // ==================== 代码风格规则 ====================
      // 注意：这些规则与 Prettier 保持兼容

      // 引号和分号
      "quotes": ["error", "double"], // 使用双引号
      "semi": ["error", "always"], // 始终使用分号

      // 逗号和换行
      "comma-dangle": ["error", "never"], // 多行不允许尾随逗号
      "eol-last": "error", // 文件末尾换行
      "no-trailing-spaces": "error", // 禁止行尾空格

      // 缩进和空格
      "indent": ["error", 2], // 2 个空格缩进
      "comma-spacing": "error", // 逗号后空格
      "key-spacing": "error", // 对象键值空格
      "keyword-spacing": "error", // 关键字空格
      "space-before-blocks": "error", // 块前空格
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always", // 匿名函数
          named: "never", // 命名函数
          asyncArrow: "always", // 异步箭头函数
        },
      ],
      "space-in-parens": "error", // 圆括号内空格
      "space-infix-ops": "error", // 操作符空格
      "space-unary-ops": "error", // 一元操作符空格
      "spaced-comment": "error", // 注释空格
      "arrow-spacing": "error", // 箭头函数空格

      // 代码块风格
      "brace-style": ["error", "1tbs", { allowSingleLine: true }], // 大括号风格
    },
  },

  // === TypeScript 专用配置 ===
  {
    // 仅对 TypeScript 文件应用的规则
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // 启用类型检查（需要 tsconfig.json）
        project: "./tsconfig.app.json",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
    },

    rules: {
      // 继承 TypeScript 推荐规则
      ...tsPlugin.configs.recommended.rules,

      // TypeScript 特定的严格规则
      "@typescript-eslint/explicit-function-return-type": "off", // 不强制函数返回类型
      "@typescript-eslint/explicit-module-boundary-types": "off", // 不强制模块边界类型
      "@typescript-eslint/no-empty-function": "warn", // 警告空函数
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // === 忽略配置 ===
  {
    // 忽略这些文件和目录
    ignores: [
      "dist/**", // 构建输出目录
      "node_modules/**", // 依赖包目录
      "*.config.js", // 配置文件
      "*.config.ts", // TypeScript 配置文件
      "coverage/**", // 测试覆盖率目录
      ".vscode/**", // VSCode 配置目录
      ".git/**", // Git 目录
    ],
  },
];