# AlertModal Component Documentation

[Linked Table of Contents](#table-of-contents)

## Table of Contents

* [1. Overview](#1-overview)
* [2. Component Structure](#2-component-structure)
* [3. Props](#3-props)
* [4. Usage Example](#4-usage-example)


## 1. Overview

The `AlertModal` component is a reusable React component that displays a modal dialog box to confirm user actions that may result in data loss.  It provides a clear and consistent user experience for critical confirmations. The component leverages pre-built components from `"@/components/ui/alert-dialog"` for enhanced reusability and maintainability.


## 2. Component Structure

The `AlertModal` component is structured using a nested approach, rendering a series of components from the `"@/components/ui/alert-dialog"` library to create the modal structure.  This promotes code organization and readability.

The structure is as follows:

* **`AlertDialog`:** The main container for the alert dialog, controlled by the `open` prop.
* **`AlertDialogContent`:** Contains the header and footer of the alert.
* **`AlertDialogHeader`:** Houses the title and description of the alert.
    * **`AlertDialogTitle`:** Displays the main title of the alert ("Are you sure you want to leave?").
    * **`AlertDialogDescription`:** Provides a detailed explanation of the implications of the user's action ("You have unsaved changes...").
* **`AlertDialogFooter`:** Contains the action buttons.
    * **`AlertDialogCancel`:** The "Cancel" button, triggering the `onCancel` prop function.
    * **`AlertDialogAction`:** The "Confirm" button, triggering the `onConfirm` prop function.


## 3. Props

The `AlertModal` component accepts the following props:

| Prop Name     | Type       | Description                                                                     | Required | Default |
|---------------|------------|---------------------------------------------------------------------------------|----------|---------|
| `isOpen`      | `boolean`  | Controls the visibility of the modal.  `true` displays the modal, `false` hides it. | Yes      |         |
| `onConfirm`   | `() => void` | Callback function executed when the "Confirm" button is clicked.               | Yes      |         |
| `onCancel`    | `() => void` | Callback function executed when the "Cancel" button is clicked.                | Yes      |         |


## 4. Usage Example

The `AlertModal` component can be used as follows:

```javascript
import { AlertModal } from './AlertModal'; // Path to your AlertModal component

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    // Handle confirmation logic here
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Handle cancellation logic here
    setIsOpen(false);
  };

  return (
    <>
      {/* ... other components ... */}
      <button onClick={() => setIsOpen(true)}>Leave Page</button>
      <AlertModal isOpen={isOpen} onConfirm={handleConfirm} onCancel={handleCancel} />
      {/* ... other components ... */}
    </>
  );
}
```

This example demonstrates how to control the modal's visibility using state and handle the confirmation and cancellation actions.  The `handleConfirm` and `handleCancel` functions should contain the specific logic to be executed based on the user's selection.  Note that appropriate error handling and state management should be implemented in these functions as needed within the application's context.
