# InvoiceDetails Component Documentation

## Table of Contents

* [1. Overview](#1-overview)
* [2. Component Structure](#2-component-structure)
* [3. Data Fetching and Management](#3-data-fetching-and-management)
* [4. Calculation Functions](#4-calculation-functions)
* [5. UI Rendering](#5-ui-rendering)


## 1. Overview

The `InvoiceDetails` component displays the details of a specific invoice. It fetches invoice data based on the ID passed through the URL parameters, calculates the subtotal, tax, and total amounts, and renders the invoice information in a user-friendly format.  The component also displays company logo if available from local storage, otherwise displays the first letter of the business name.


## 2. Component Structure

The component utilizes the following React hooks and libraries:

*   `useParams` and `useRouter` from `next/navigation`: For accessing URL parameters and navigating between routes.
*   `useInvoices` from `../../context/InvoiceContext`: For accessing invoice data from a global context.
*   `useState` and `useEffect` from `react`: For managing component state and side effects.
*   `Button` from `@/components/ui/button`: A custom button component.

The component's structure is organized into distinct sections for displaying invoice details, including:

*   Invoice header with company logo, back button, and download button.
*   Invoice information: Business details, customer details, and invoice number.
*   Invoice date and due date.
*   Itemized table of goods and services.
*   Subtotal, tax, and total calculations.
*   Optional notes and terms and conditions sections.


## 3. Data Fetching and Management

The component fetches the invoice data using the `useInvoices` hook which provides access to the `invoices` array.  The specific invoice is retrieved using the `id` parameter from the URL:

```javascript
const { id } = useParams();
const { invoices } = useInvoices();
const invoice = invoices.find(inv => inv.id === parseInt(id as string));
```

If no matching invoice is found, a "Invoice not found" message is displayed.

Company logo is retrieved from local storage using `useEffect` hook. If no logo is found, a placeholder is displayed.

```javascript
useEffect(() => {
    const savedDetails = localStorage.getItem('companyDetails');
    if (savedDetails) {
      const details = JSON.parse(savedDetails);
      setCompanyLogo(details.logo || null);
    }
  }, []);
```


## 4. Calculation Functions

The component includes three functions for calculating invoice amounts:

*   **`calculateSubtotal()`**: This function calculates the subtotal by iterating through the `invoice.items` array and summing the product of each item's rate and quantity using `reduce`:

    ```javascript
    const calculateSubtotal = () => {
      return invoice.items.reduce((sum, item) => sum + item.rate * item.quantity, 0);
    };
    ```

*   **`calculateTax()`**: This function calculates the tax amount by multiplying the subtotal by the invoice's tax percentage:

    ```javascript
    const calculateTax = () => {
      return calculateSubtotal() * (invoice.taxPercentage / 100);
    };
    ```

*   **`calculateTotal()`**: This function calculates the total amount by adding the subtotal and tax:

    ```javascript
    const calculateTotal = () => {
      return calculateSubtotal() + calculateTax();
    };
    ```


## 5. UI Rendering

The component renders the invoice details using a combination of HTML elements and Tailwind CSS classes for styling.  The `invoice` object's properties are used to populate the displayed information.  Conditional rendering is used to display optional fields (notes and terms) only if they exist in the `invoice` object.  The items are displayed in a table, with each row representing an item from the `invoice.items` array.  The company logo is conditionally rendered based on its availability in local storage. If no logo is present, the first character of the business name is displayed in a placeholder.
