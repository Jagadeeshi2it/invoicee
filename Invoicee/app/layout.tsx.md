# RootLayout.js - Internal Documentation

## Table of Contents

* [1. Overview](#1-overview)
* [2. Imports](#2-imports)
* [3. Metadata](#3-metadata)
* [4. `RootLayout` Component](#4-rootlayout-component)
    * [4.1 Function Parameters](#41-function-parameters)
    * [4.2 Component Structure](#42-component-structure)
    * [4.3 Context Providers](#43-context-providers)
    * [4.4 Theme Provider](#44-theme-provider)


## 1. Overview

This document provides internal documentation for the `RootLayout.js` component, which serves as the main layout for the Invoicee application.  It handles global styling, context providers, and the overall structure of the application.


## 2. Imports

The component utilizes several imports to provide functionality and styling:

| Import Statement                 | Description                                                              |
|---------------------------------|--------------------------------------------------------------------------|
| `'./globals.css'`                | Imports global CSS styles for the application.                           |
| `{ Inter } from 'next/font/google'` | Imports the Inter font from Google Fonts for improved typography.        |
| `{ InvoiceProvider } from './context/InvoiceContext'` | Imports the Invoice context provider for managing invoice data.     |
| `{ FormProvider } from './context/FormContext'` | Imports the Form context provider for managing form data.           |
| `{ ThemeProvider } from '@/components/theme-provider'` | Imports a custom theme provider for managing application themes. |
| `{ SideMenu } from '@/components/SideMenu'` | Imports the SideMenu component for navigation.                       |


## 3. Metadata

The `metadata` object defines the metadata for the application, used for SEO and other purposes:

| Property    | Value                                         |
|-------------|-------------------------------------------------|
| `title`      | `'Invoicee - Invoice Generator'`                 |
| `description` | `'Generate and manage invoices seamlessly'`       |


## 4. `RootLayout` Component

The `RootLayout` component is a functional component that renders the basic HTML structure and provides context to child components.

### 4.1 Function Parameters

The `RootLayout` component accepts a single parameter:

| Parameter | Type             | Description                                     |
|-----------|-------------------|-------------------------------------------------|
| `children` | `React.ReactNode` |  The children components to be rendered within the layout. |


### 4.2 Component Structure

The component renders an HTML structure with the following key elements:

1. **HTML tag:** Provides the basic HTML structure.
2. **Body tag:** Contains the main content and styling. The `inter.className` applies the imported Inter font.
3. **ThemeProvider:** Wraps the application to enable theming using the custom `ThemeProvider` component.  `attribute="class"`, `defaultTheme="system"`, `enableSystem`, and `disableTransitionOnChange` configure the theme provider's behavior.
4. **InvoiceProvider and FormProvider:** Nest the application content within context providers for managing invoice and form data respectively. This makes this data accessible to any child components.
5. **Main layout container:** A flexbox container (`div` with class `flex h-screen bg-background text-foreground`) divides the screen into a side menu and main content area.
6. **SideMenu:** Renders the navigation side menu.
7. **Main content area:** Contains the `children` prop, which dynamically renders the content of each page.  This is wrapped in a `div` with `flex-1 overflow-auto` to ensure it takes up available space and handles content scrolling.
8. **Main content wrapper:** A `main` tag with classes to provide consistent margins and padding (`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8`).


### 4.3 Context Providers

The `InvoiceProvider` and `FormProvider` are crucial for managing application state. They provide context to child components, allowing them to access and modify invoice and form data, respectively, without prop drilling.

### 4.4 Theme Provider

The `ThemeProvider` component manages the application's theme.  The provided attributes control how the theme is applied and whether system-level theme preferences are utilized.  The `disableTransitionOnChange` prevents visual transitions during theme changes, improving performance.
