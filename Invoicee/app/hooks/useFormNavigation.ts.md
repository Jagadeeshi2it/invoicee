# useFormNavigation Hook Documentation

[Linked Table of Contents](#table-of-contents)

## Table of Contents

* [1. Overview](#1-overview)
* [2. Hook Functionality](#2-hook-functionality)
    * [2.1. State Variables](#21-state-variables)
    * [2.2. `handleNavigation` Function](#22-handlenavigation-function)
    * [2.3. `confirmNavigation` Function](#23-confirmnavigation-function)
    * [2.4. `cancelNavigation` Function](#24-cancelnavigation-function)
* [3. `useEffect` Hook Explanation](#3-useeffect-hook-explanation)
* [4. Algorithm Description](#4-algorithm-description)


## 1. Overview

The `useFormNavigation` hook is a custom React hook designed to manage navigation within a form-based application.  It prevents accidental navigation away from a form with unsaved changes by prompting the user with a modal confirmation.  The hook utilizes the `next/navigation` library for routing and a custom `FormContext` for tracking form changes.


## 2. Hook Functionality

This hook provides a mechanism to safely navigate away from a form, preventing data loss if the form is dirty (i.e., changes have been made but not saved).


### 2.1. State Variables

| Variable Name      | Type                      | Description                                                                  |
|----------------------|---------------------------|------------------------------------------------------------------------------|
| `showModal`          | `boolean`                  | Controls the visibility of the confirmation modal.                          |
| `pendingUrl`        | `string \| null`           | Stores the URL to navigate to if the form is dirty and the user confirms. |


### 2.2. `handleNavigation` Function

This function is called when the user attempts to navigate away from the form.

* **Input:** `url: string` - The URL to navigate to.
* **Logic:**
    * Checks if the form is dirty (`isFormDirty` from `FormContext`).
    * If the form is dirty:
        * Shows the confirmation modal (`setShowModal(true)`).
        * Stores the target URL (`setPendingUrl(url)`).
    * If the form is not dirty:
        * Directly navigates to the URL using `router.push(url)`.


### 2.3. `confirmNavigation` Function

This function is called when the user confirms navigation from the confirmation modal.

* **Logic:**
    * Marks the form as clean (`setIsFormDirty(false)`).
    * Hides the confirmation modal (`setShowModal(false)`).
    * If a pending URL exists (`pendingUrl`), navigates to that URL using `router.push(pendingUrl)`.


### 2.4. `cancelNavigation` Function

This function is called when the user cancels navigation from the confirmation modal.

* **Logic:**
    * Hides the confirmation modal (`setShowModal(false)`).
    * Clears the pending URL (`setPendingUrl(null)`).


## 3. `useEffect` Hook Explanation

The `useEffect` hook is used to manage the browser's `beforeunload` event.  This event fires when the user attempts to leave the page (e.g., by closing the tab or navigating away).

* **Event Listener:**  An event listener is added to the `window` object to listen for the `beforeunload` event. The `handleBeforeUnload` function is executed when this event occurs.
* **`handleBeforeUnload` Function:** This function checks if the form is dirty. If it is, it prevents the default behavior of the `beforeunload` event (which would allow the user to leave the page without confirmation) and sets `e.returnValue` to an empty string, which typically displays a browser confirmation dialog.
* **Cleanup Function:** The returned function from `useEffect` removes the event listener when the component unmounts to prevent memory leaks.  This ensures that the event listener is detached when the component is no longer needed.


## 4. Algorithm Description

The core algorithm of `useFormNavigation` is a state machine with three states:

1. **Normal State:** The form is either clean or the user is not attempting to navigate.  Navigation happens directly.
2. **Pending State:** The user tries to navigate away from a dirty form. The confirmation modal is shown, and the target URL is stored.
3. **Confirmed/Cancelled State:** The user either confirms or cancels navigation from the modal.  The appropriate action (navigation or clearing the pending state) is performed.

The `useEffect` hook adds a layer of preventative behavior outside of the user's explicit navigation attempt.  If the user attempts to leave the page without using the navigation controls, the browser's built-in beforeunload mechanism is utilized to warn them about unsaved changes.  This mechanism is independent of the modal confirmation provided by the hook itself, offering a robust safety net.
