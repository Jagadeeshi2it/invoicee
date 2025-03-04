# Internal Code Documentation: Invoice Management System

[Linked Table of Contents](#linked-table-of-contents)

## Linked Table of Contents

* [1. Overview](#1-overview)
* [2. Data Structures](#2-data-structures)
    * [2.1. `InvoiceItem`](#21-invoiceitem)
    * [2.2. `Invoice`](#22-invoice)
    * [2.3. `InvoiceContextType`](#23-invoicecontetype)
* [3. `InvoiceProvider` Component](#3-invoice-provider-component)
* [4. `useInvoices` Hook](#4-useinvoices-hook)


## 1. Overview

This document details the implementation of a React-based invoice management system.  The system utilizes React Context API for managing invoice data and local storage for persistence.  The core components are `InvoiceProvider` and `useInvoices`.


## 2. Data Structures

This section describes the data structures used to represent invoices and their components.

### 2.1. `InvoiceItem`

| Field          | Type    | Description                                  |
|-----------------|---------|----------------------------------------------|
| `name`          | `string` | Name of the invoice item.                    |
| `rate`          | `number` | Rate of the invoice item.                    |
| `quantity`      | `number` | Quantity of the invoice item.                |


### 2.2. `Invoice`

| Field             | Type             | Description                                      |
|----------------------|-------------------|--------------------------------------------------|
| `id`                | `number`          | Unique identifier for the invoice.                |
| `number`            | `string`          | Invoice number.                                   |
| `customerName`      | `string`          | Name of the customer.                             |
| `customerAddress`   | `string`          | Address of the customer.                          |
| `date`              | `string`          | Invoice date.                                     |
| `dueDate`           | `string`          | Invoice due date.                                |
| `items`             | `InvoiceItem[]`   | Array of invoice items.                          |
| `taxPercentage`     | `number`          | Tax percentage applied to the invoice.           |
| `notes`             | `string`          | Any additional notes for the invoice.            |
| `terms`             | `string`          | Payment terms for the invoice.                    |
| `businessName`      | `string`          | Name of the business issuing the invoice.         |
| `businessLocation`  | `string`          | Location of the business issuing the invoice.     |


### 2.3. `InvoiceContextType`

This type defines the structure of the context object provided by `InvoiceProvider`.

| Field       | Type                     | Description                                           |
|--------------|--------------------------|-------------------------------------------------------|
| `invoices`  | `Invoice[]`              | Array of all invoices.                               |
| `addInvoice` | `(invoice: Invoice) => void` | Function to add a new invoice to the context.         |



## 3. `InvoiceProvider` Component

The `InvoiceProvider` component manages the state of invoices using the React `useState` hook. It persists invoice data in the browser's local storage using `localStorage`.

* **State Management:** The component uses `useState` to manage an array of `Invoice` objects.
* **Data Persistence:** `useEffect` loads invoices from `localStorage` on component mount.  Changes to the `invoices` state trigger an update to `localStorage`.
* **`addInvoice` Function:** This function takes a new `Invoice` object as input. It creates a new array containing all existing invoices and the new invoice using the spread syntax (`...invoices, invoice`). This new array is then set as the new state using `setInvoices`, updating the UI and persisting the data to `localStorage`.  This ensures that any new invoice is added to the existing invoice list and the list is stored in the browser's local storage for persistence across sessions.


## 4. `useInvoices` Hook

The `useInvoices` hook provides a convenient way to access the invoice context within functional components.

* **Context Access:** It uses `useContext` to access the `InvoiceContext`.
* **Error Handling:** It throws an error if the context is undefined, indicating that the component is not rendered within an `InvoiceProvider`.  This robust error handling helps pinpoint issues with component structure.  The error message explicitly directs developers to ensure the component is used correctly within the provider.
* **Return Value:** It returns the `InvoiceContextType` object, providing access to the `invoices` array and the `addInvoice` function.
