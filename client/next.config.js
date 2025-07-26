module.exports = {
    webpackDevMiddleware: (config) => {
        // Enable Hot Module Replacement (HMR) for development
        config.watchOptions = {
            ...config.watchOptions,
            poll: 1000, // Check for changes every second
            aggregateTimeout: 300, // Delay before rebuilding after changes
        };
        return config;

    }
}