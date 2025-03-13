# CoolHTML

CoolHTML is an ultra-minimal framework for building websites without writing HTML. It uses intuitive keywords, smart defaults, and a streamlined JavaScript API to reduce development time and code complexity.

## Features

- Build entire websites with minimal JavaScript code
- No HTML knowledge required
- Responsive design using Bootstrap 5 under the hood
- Simple markdown-like text formatting
- One-line site creation with the global factory function
- Common terminology instead of framework-specific jargon
- Automatic loading of required dependencies

## Installation

Simply include the CoolHTML script in your HTML file:

```html
<script src="https://coolhtml.megadeploy.com/CoolHTML.js"></script>
```

Or download the library and include it locally:

```html
<script src="CoolHTML.js"></script>
```

## Quick Start

Create an entire website with a single function call:

```javascript
cool().site({
    // Theme settings
    theme: { primary: '#4361ee', secondary: '#3f37c9' },
    
    // Navigation
    nav: {
        title: 'CoolHTML',
        links: ['Home', 'Features', 'Pricing', 'Contact'],
        btn: { text: 'Get Started', outline: true }
    },
    
    // Hero section
    hero: {
        t: 'Build Websites in *One Line*',  // 't' is shorthand for 'title'
        st: 'No HTML required. Just pure simplicity.',
        dark: true,
        bg: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
        btns: [
            { text: 'Get Started', type: 'light', size: 'lg' },
            { text: 'Learn More', outline: true, type: 'light' }
        ]
    },
    
    // Content sections
    sections: [
        {
            t: 'How It Works',
            text: "CoolHTML uses *simple keywords* and _minimal syntax_ to create beautiful websites.\n\nNo HTML knowledge required."
        }
    ],
    
    // Footer
    footer: {
        dark: true,
        copyright: '© 2025 My Company'
    }
});
```

## Individual Components

You can also use components individually:

```javascript
// Create a navigation bar
cool().nav({
    title: 'My Website',
    links: ['Home', 'About', 'Contact']
});

// Add a hero section
cool().hero({
    title: 'Welcome',
    subtitle: 'To my awesome website'
});

// Add features
cool().features({
    title: 'Key Features',
    items: [
        { icon: 'bi-lightning', title: 'Fast', text: 'Build websites quickly' },
        { icon: 'bi-code-slash', title: 'Simple', text: 'No HTML required' }
    ]
});

// Add a footer
cool().footer('© 2025 My Company');
```

## Documentation

For complete documentation, visit our [documentation page]([https://megadeploy.github.io/coolhtml/docs](https://coolhtml.megadeploy.com/)).

## Demo

For a Demo, visit our [demo page](https://coolhtml.megadeploy.com/).


## License

MIT License

## About

Developed and maintained by [Megadeploy](https://megadeploy.com).
