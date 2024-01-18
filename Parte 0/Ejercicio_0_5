sequenceDiagram
    participant browser
    participant server
    participant spa

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document (SPA)
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

    browser->>spa: User interacts with the SPA
    activate spa
    spa-->>spa: SPA handles user interactions and updates
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
