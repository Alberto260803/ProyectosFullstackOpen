sequenceDiagram
    participant browser
    participant server
    participant spa
    participant notes

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: SPA HTML document
    deactivate server

    Note right of browser: The SPA loads and initializes

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file (SPA logic)
    deactivate server

    Note right of browser: The SPA handles navigation and data fetching

    browser->>server: SPA requests data from the server
    activate server
    server-->>server: Server processes SPA data request
    server-->>browser: JSON data for the SPA
    deactivate server

    Note right of browser: The SPA dynamically updates the content

    browser->>spa: User interacts with the SPA to create a new note
    activate spa
    spa-->>spa: User fills out and submits new note form
    deactivate spa

    Note right of browser: SPA sends a POST request to the server to create a new note

    browser->>server: SPA sends POST request to create a new note
    activate server
    server-->>server: Server processes the creation of a new note
    server-->>server: Server adds the new note to the notes data
    server-->>browser: Response indicating success
    deactivate server

    Note right of browser: The SPA updates the UI with the new note

    browser->>spa: Updated content displayed in the SPA
    activate spa
    spa-->>browser: Updated UI with the new note
    deactivate spa

    Note right of browser: The SPA may make additional API requests

    browser->>server: SPA makes API request for additional data
    activate server
    server-->>browser: Additional JSON data
    deactivate server

    Note right of browser: The SPA dynamically updates the content again

    browser->>spa: Updated content displayed in the SPA
    activate spa
    spa-->>browser: Updated UI in response to user actions
    deactivate spa
