import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";
import { API_KEY, API_SECRET_KEY, TOKEN, URL, HOST } from '../config.js';

export const shopify = shopifyApi({
    apiKey: API_KEY,
    apiSecretKey: API_SECRET_KEY,
    apiVersion: ApiVersion.July24,
    isCustomStoreApp: true,
    adminApiAccessToken: TOKEN,
    isEmbeddedApp: false,
    hostName: HOST,
    restResources,
    future: {
        lineItemBilling: true,
        customerAddressDefaultFix: true,
        unstable_managedPricingSupport: true,
    },
});

export const session = shopify.session.customAppSession(URL);
