# Manage Items Component Documentation

## Table of Contents

* [1. Overview](#1-overview)
* [2. Data Handling](#2-data-handling)
* [3. Item Management Functions](#3-item-management-functions)
    * [3.1 `addItem` Function](#31-additem-function)
    * [3.2 `removeItem` Function](#32-removeitem-function)
    * [3.3 `handleFileUpload` Function](#33-handlefileupload-function)
* [4. Form Handling and Navigation](#4-form-handling-and-navigation)
* [5. Local Storage Management](#5-local-storage-management)


## 1. Overview

The `ManageItems` component is a React component responsible for managing a list of items.  Users can add new items manually, import items from an Excel file, and delete existing items. The component utilizes local storage to persist data between sessions.  Data validation is performed to ensure data integrity. The component integrates with a form context for managing form state and navigation, and uses a modal for confirmation before navigating away from the component if the form is dirty.


## 2. Data Handling

The component uses the following state variables:

| Variable Name          | Type                  | Description                                                                 |
|-----------------------|-----------------------|-----------------------------------------------------------------------------|
| `items`                | `Item[]`              | Array of `Item` objects representing the managed items.                     |
| `newItemName`          | `string`              | Name of the item to be added.                                               |
| `newItemRate`          | `string`              | Rate of the item to be added.                                               |


The `Item` type is defined as:

```typescript
type Item = {
  id: string;
  name: string;
  rate: number;
};
```

## 3. Item Management Functions

### 3.1 `addItem` Function

This function adds a new item to the `items` array.  It performs the following steps:

1. Checks if `newItemName` and `newItemRate` are both non-empty.
2. Creates a new `Item` object with a unique `id` generated using `Date.now()` to ensure uniqueness, the provided `name`, and the parsed `rate`. If parsing fails the rate defaults to 0.
3. Updates the `items` array using the spread operator (`...`).
4. Saves the updated `items` array to local storage using `saveItems`.
5. Clears the input fields for `newItemName` and `newItemRate`.


### 3.2 `removeItem` Function

This function removes an item from the `items` array based on its `id`.  It filters the `items` array to exclude the item with the matching `id` and updates the state and local storage.


### 3.3 `handleFileUpload` Function

This function handles the import of items from an Excel file.  It uses the `xlsx` library to read the file contents. The algorithm processes the file as follows:

1. Reads the selected Excel file using `FileReader`.
2. Parses the file using the `xlsx` library.
3. Extracts the data from the first sheet.
4. Converts the sheet data to JSON using `XLSX.utils.sheet_to_json`.
5. Maps the JSON data to an array of `Item` objects.  Handles variations in column names for item name and rate to improve robustness and imports data even if the column names differ slightly.
6. Adds a unique ID to each imported item using a combination of `Date.now()` and a random string.
7. Adds the imported items to the existing `items` array.
8. Saves the updated array to local storage.
9. Displays a success toast message indicating the number of imported items.
10. Clears the file input field.
11. Handles potential errors by logging warnings to the console if a row is missing a name.  Import continues even if some rows have missing data.


## 4. Form Handling and Navigation

The component utilizes the `useFormContext` and `useFormNavigation` hooks to manage form state and navigation.  `setIsFormDirty` updates the form's dirty state whenever changes are detected in the inputs or the item list. The `showModal`, `handleNavigation`, `confirmNavigation`, and `cancelNavigation` functions manage a modal that prompts for confirmation when navigating away from the form if changes have been made.


## 5. Local Storage Management

The component uses local storage to persist the `items` array between sessions.  The `saveItems` function handles saving the updated item list to local storage using `JSON.stringify`. The `useEffect` hook loads the saved items from local storage on component mount.  The `beforeunload` event listener is used to prompt the user to confirm navigation if the form is dirty, preventing accidental data loss.
