import docsController from './docs.js';
import configController from './config.js';
import apiController from './api.js';
import rootController from './root.js';

export const registerRoutes = (fastify, options) => {
    fastify.register(docsController, options);
    fastify.register(configController, options);
    fastify.register(apiController, options);
    fastify.register(rootController, options);
};
