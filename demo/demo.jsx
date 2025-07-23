import React from 'react';
import { createRoot } from 'react-dom/client';
import ThreatLoomApp from '../src/ThreatLoomApp';

// Enhanced console protection to completely eliminate [object Event] logging
if (typeof window !== 'undefined') {
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug,
    };

    const filterObjectEvents = (args) => {
        return args.filter((arg) => {
            if (typeof arg === 'object' && arg !== null) {
                const str = String(arg);
                return (
                    !str.includes('[object Event]') &&
                    !str.includes('[object Object]') &&
                    !str.includes('[object HTMLElement]') &&
                    str !== '[object Event]'
                );
            }
            if (typeof arg === 'string') {
                return !arg.includes('[webpack-dev-server] [object Event]');
            }
            return true;
        });
    };

    console.log = function (...args) {
        const filtered = filterObjectEvents(args);
        if (filtered.length > 0) originalConsole.log.apply(console, filtered);
    };

    console.warn = function (...args) {
        const filtered = filterObjectEvents(args);
        if (filtered.length > 0) originalConsole.warn.apply(console, filtered);
    };

    console.error = function (...args) {
        const filtered = filterObjectEvents(args);
        if (filtered.length > 0) originalConsole.error.apply(console, filtered);
    };

    console.info = function (...args) {
        const filtered = filterObjectEvents(args);
        if (filtered.length > 0) originalConsole.info.apply(console, filtered);
    };

    console.debug = function (...args) {
        const filtered = filterObjectEvents(args);
        if (filtered.length > 0) originalConsole.debug.apply(console, filtered);
    };

    // Additional protection for webpack dev server
    if (window.addEventListener) {
        const originalAddEventListener = window.addEventListener;
        window.addEventListener = function (type, listener, options) {
            if (typeof listener === 'function') {
                const wrappedListener = function (event) {
                    try {
                        return listener.call(this, event);
                    } catch (error) {
                        if (!String(error).includes('[object Event]')) {
                            originalConsole.error.call(console, error);
                        }
                    }
                };
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }
}

// Initialize the ThreatLoom app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ThreatLoomApp />);
