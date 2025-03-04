# NewInvoice Component Documentation

## Table of Contents

* [1. Overview](#1-overview)
* [2. Data Structures](#2-data-structures)
* [3. State Variables](#3-state-variables)
* [4. Effects Hooks](#4-effects-hooks)
* [5. Event Handlers](#5-event-handlers)
    * [5.1 `handleAddItem`](#51-handleadditem)
    * [5.2 `handleRemoveItem`](#52-handleremoveitem)
    * [5.3 `handleItemChange`](#53-handleitemchange)
    * [5.4 `handleSubmit`](#54-handlesubmit)
* [6. Calculation Functions](#6-calculation-functions)
    * [6.1 `calculateSubtotal`](#61-calculatesubtotal)
    * [6.2 `calculateTax`](#62-calculatetax)
    * [6.3 `calculateTotal`](#63-calculatetotal)
* [7. Usage](#7-usage)


## 1. Overview

The `NewInvoice` component is a React component responsible for creating new invoices. It uses several custom hooks and components to manage form data, navigation, and UI elements.  The component allows users to input customer and business details, add invoice items, specify tax, add notes, and generate the invoice.  Form data persistence across page refreshes is managed via `localStorage`.  A confirmation modal prevents accidental data loss if the form is dirty upon attempting to navigate away.


## 2. Data Structures

The component utilizes the following TypeScript types:

| Type Name     | Description                                      |
|---------------|--------------------------------------------------|
| `Item`        | Represents a single item in the inventory.       |
| `InvoiceItem` | Represents an item within a specific invoice.     |


The structures are defined as follows:

```typescript
type Item = {
  id: string;
  name: string;
  rate: number;
};

type InvoiceItem = {
  itemId: string;
  name: string;
  rate: number;
  quantity: number;
};
```

## 3. State Variables

The component maintains the following state variables using the `useState` hook:

| Variable Name         | Type                     | Description                                                                  |
|-----------------------|--------------------------|------------------------------------------------------------------------------|
| `customerName`        | `string`                 | Name of the customer.                                                        |
| `customerAddress`     | `string`                 | Address of the customer.                                                     |
| `invoiceNumber`       | `string`                 | Invoice number.                                                              |
| `invoiceDate`         | `string`                 | Invoice date (YYYY-MM-DD).                                                  |
| `dueDate`             | `string`                 | Due date (YYYY-MM-DD).                                                      |
| `items`               | `InvoiceItem[]`          | Array of invoice items.                                                     |
| `taxPercentage`       | `number`                 | Tax percentage.                                                              |
| `notes`               | `string`                 | Additional notes for the invoice.                                            |
| `terms`               | `string`                 | Terms and conditions for the invoice.                                        |
| `businessName`        | `string`                 | Name of the business generating the invoice.                                |
| `businessLocation`    | `string`                 | Location of the business generating the invoice.                            |
| `managedItems`        | `Item[]`                  | Array of managed items, populated from local storage.                       |


## 4. Effects Hooks

The component uses three `useEffect` hooks:

1. **Initial Data Loading:** This hook loads business details and managed items from `localStorage` on component mount.

2. **Form Dirty State:** This hook updates the `isFormDirty` state whenever any of the form fields change, indicating whether the form has unsaved changes.

3. **BeforeUnload Listener:** This hook adds and removes a `beforeunload` event listener to prevent accidental data loss if the form is dirty and the user attempts to navigate away from the page.  This listener triggers a browser confirmation prompt.


## 5. Event Handlers

### 5.1 `handleAddItem`

This function adds a new, empty invoice item to the `items` array.  The new item has default values for `name`, `rate`, and `quantity`.

### 5.2 `handleRemoveItem`

This function removes an invoice item from the `items` array at the specified index.

### 5.3 `handleItemChange`

This function updates a specific field of an invoice item at a given index. It handles different field types (string, number) and updates `itemId` by finding the corresponding `Item` in `managedItems`.  Input validation for rate ensures only numbers with at most two decimal places are accepted.


### 5.4 `handleSubmit`

This function handles form submission. It creates a new invoice object, calls the `addInvoice` function from the `InvoiceContext` to add the invoice, resets the `isFormDirty` state, and navigates to the home page (`/`).


## 6. Calculation Functions

### 6.1 `calculateSubtotal`

This function calculates the subtotal of the invoice by summing the product of `rate` and `quantity` for each item in the `items` array.  It uses the `reduce` method for efficient calculation.

### 6.2 `calculateTax`

This function calculates the tax amount by multiplying the subtotal by the `taxPercentage`.

### 6.3 `calculateTotal`

This function calculates the total amount of the invoice by adding the subtotal and the tax amount.


## 7. Usage

The `NewInvoice` component is used to create a new invoice form.  It renders various form inputs, a section for adding/managing invoice items, and displays calculated amounts.  The component leverages the `AlertModal` component for confirmation and integrates with the `useFormNavigation` custom hook for navigation management.  The component also dynamically generates input fields for each item, making it scalable to handle multiple items per invoice.
