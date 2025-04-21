(function() {
    // Default configuration
    const defaultConfig = {
        configUrl: '/schema-config.json',
        brand: 'Your Brand Name',
        logoUrl: 'https://yourwebsite.com/logo.png',
        siteUrl: window.location.origin,
        socialLinks: [
            'https://www.facebook.com/yourbrand',
            'https://www.twitter.com/yourbrand',
            'https://www.linkedin.com/company/yourbrand'
        ],
        address: {
            streetAddress: '123 Business St',
            addressLocality: 'City',
            addressRegion: 'State',
            postalCode: '12345',
            addressCountry: 'US'
        },
        geo: {
            latitude: 40.7128,
            longitude: -74.0060
        },
        category: 'Your Business Category',
        telephone: '+1-123-456-7890',
        openingHours: 'Mo-Fr 09:00-17:00',
        faqSelectors: ['[class*="faq"] h2', '[class*="faq"] h3', '[id*="faq"] h2', '[id*="faq"] h3'],
        templateUrl: '/schema-templates.json',
        debug: false,
        remoteLogUrl: null // e.g., 'https://your-logging-service.com/log'
    };

    let config = defaultConfig;

    // Default schema templates
    const defaultSchemaTemplates = {
        'pillar': {
            '@type': 'WebPage',
            template: {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                'name': '{title}',
                'description': '{metaDescription}',
                'mainEntity': {
                    '@type': 'Article',
                    'headline': '{title}',
                    'datePublished': '{datePublished}',
                    'dateModified': '{dateModified}',
                    'author': {
                        '@type': 'Organization',
                        'name': '{brand}'
                    }
                }
            }
        },
        'article': {
            '@type': 'Article',
            template: {
                '@context': 'https://schema.org',
                '@type': 'Article',
                'headline': '{title}',
                'description': '{metaDescription}',
                'datePublished': '{datePublished}',
                'dateModified': '{dateModified}',
                'author': {
                    '@type': 'Organization',
                    'name': '{brand}'
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': '{brand}',
                    'logo': {
                        '@type': 'ImageObject',
                        'url': '{logoUrl}'
                    }
                }
            }
        },
        'faq': {
            '@type': 'FAQPage',
            template: {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                'mainEntity': []
            }
        }
    };

    let schemaMapping = defaultSchemaTemplates;

    // Hard-coded organization and local business schema
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': '{brand}',
        'url': '{siteUrl}',
        'logo': '{logoUrl}',
        'sameAs': [] // Populated from config.socialLinks
    };

    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': '{brand}',
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': '{streetAddress}',
            'addressLocality': '{addressLocality}',
            'addressRegion': '{addressRegion}',
            'postalCode': '{postalCode}',
            'addressCountry': '{addressCountry}'
        },
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': '{latitude}',
            'longitude': '{longitude}'
        },
        'category': '{category}',
        'telephone': '{telephone}',
        'openingHours': '{openingHours}'
    };

    // Utility to fetch external resources
    async function fetchResource(url, fallback) {
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            return await response.json();
        } catch (e) {
            console.warn(`Error fetching ${url}:`, e);
            return fallback;
        }
    }

    // Utility to replace placeholders in schema
    function replacePlaceholders(schema, data) {
        const schemaString = JSON.stringify(schema);
        let replaced = schemaString;
        for (const [key, value] of Object.entries(data)) {
            replaced = replaced.replace(new RegExp(`{${key}}`, 'g'), value || '');
        }
        try {
            return JSON.parse(replaced);
        } catch (e) {
            console.error('Error parsing schema:', e);
            return {};
        }
    }

    // Basic schema validation
    function validateSchema(schema) {
        if (!schema['@context'] || !schema['@type']) {
            return false;
        }
        // Add more validation rules as needed (e.g., required fields per type)
        return true;
    }

    // Log to remote service
    function logToRemote(message, level = 'info') {
        if (config.remoteLogUrl && navigator.sendBeacon) {
            navigator.sendBeacon(config.remoteLogUrl, JSON.stringify({ message, level, timestamp: new Date().toISOString() }));
        }
        if (config.debug) {
            console[level](message);
        }
    }

    // Advanced page type detection with scoring
    function detectPageType() {
        const signals = [
            {
                test: () => document.querySelector('meta[name="page-type"]')?.content || document.body.dataset.pageType,
                weight: 1.0,
                type: (value) => value
            },
            {
                test: () => document.querySelector('[class*="faq"], [id*="faq"]') || document.body.innerText.toLowerCase().includes('question'),
                weight: 0.8,
                type: () => 'faq'
            },
            {
                test: () => document.querySelector('article') || document.title.toLowerCase().includes('blog') || document.querySelector('meta[name="description"]')?.content.toLowerCase().includes('article'),
                weight: 0.7,
                type: () => 'article'
            },
            {
                test: () => true, // Fallback
                weight: 0.1,
                type: () => 'pillar'
            }
        ];

        let highestScore = 0;
        let detectedType = 'pillar';

        signals.forEach(signal => {
            const result = signal.test();
            if (result) {
                const score = signal.weight;
                if (score > highestScore && schemaMapping[signal.type(result)]) {
                    highestScore = score;
                    detectedType = signal.type(result);
                }
            }
        });

        return detectedType;
    }

    // Extract FAQ questions and answers
    function extractFAQ() {
        const faqItems = [];
        const selectors = config.faqSelectors || [];
        const elements = document.querySelectorAll(selectors.join(', '));

        elements.forEach((question) => {
            const answer = question.nextElementSibling?.textContent.trim() || '';
            if (answer) {
                faqItems.push({
                    '@type': 'Question',
                    'name': question.textContent.trim(),
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': answer
                    }
                });
            }
        });

        // Check for existing schema.org FAQ data
        const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
        existingSchemas.forEach(script => {
            try {
                const data = JSON.parse(script.textContent);
                if (data['@type'] === 'FAQPage' && data.mainEntity) {
                    faqItems.push(...data.mainEntity);
                }
            } catch (e) {}
        });

        return faqItems;
    }

    // Main function to generate and inject schema
    async function injectSchema() {
        try {
            // Gather page data
            const pageData = {
                title: document.title || 'Untitled Page',
                metaDescription: document.querySelector('meta[name="description"]')?.content || '',
                datePublished: document.querySelector('meta[name="article:published_time"]')?.content || new Date().toISOString(),
                dateModified: document.querySelector('meta[name="article:modified_time"]')?.content || new Date().toISOString(),
                brand: config.brand,
                siteUrl: config.siteUrl,
                logoUrl: config.logoUrl,
                streetAddress: config.address.streetAddress,
                addressLocality: config.address.addressLocality,
                addressRegion: config.address.addressRegion,
                postalCode: config.address.postalCode,
                addressCountry: config.address.addressCountry,
                latitude: config.geo.latitude,
                longitude: config.geo.longitude,
                category: config.category,
                telephone: config.telephone,
                openingHours: config.openingHours
            };

            // Detect page type
            const pageType = detectPageType();
            let schema = schemaMapping[pageType]?.template;

            if (!schema) {
                logToRemote(`No schema template for page type: ${pageType}`, 'warn');
                return;
            }

            // Handle FAQ page specifically
            if (pageType === 'faq') {
                schema.mainEntity = extractFAQ();
            }

            // Replace placeholders
            schema = replacePlaceholders(schema, pageData);
            const orgSchema = replacePlaceholders(organizationSchema, { ...pageData, sameAs: JSON.stringify(config.socialLinks) });
            const localSchema = replacePlaceholders(localBusinessSchema, pageData);

            // Validate schemas
            const finalSchema = [schema, orgSchema, localSchema].filter(s => validateSchema(s));

            if (finalSchema.length === 0) {
                logToRemote('No valid schemas generated', 'error');
                return;
            }

            // Remove existing schema to avoid duplicates
            document.querySelectorAll('script[data-schema-injector]').forEach(script => script.remove());

            // Inject schema
            const scriptTag = document.createElement('script');
            scriptTag.type = 'application/ld+json';
            scriptTag.dataset.schemaInjector = 'true';
            scriptTag.textContent = JSON.stringify(finalSchema, null, 2);
            document.head.appendChild(scriptTag);

            logToRemote('Schema injected successfully for page type: ' + pageType);
        } catch (e) {
            logToRemote('Error injecting schema: ' + e.message, 'error');
        }
    }

    // Initialize and handle dynamic content
    async function initialize() {
        // Load external configuration
        config = Object.assign(defaultConfig, await fetchResource(config.configUrl, {}), window.schemaConfig || {});

        // Load external schema templates
        schemaMapping = Object.assign(defaultSchemaTemplates, await fetchResource(config.templateUrl, {}));

        // Run initial injection
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => requestIdleCallback(injectSchema));
        } else {
            requestIdleCallback(injectSchema);
        }

        // Observe DOM changes for SPAs
        const observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.type === 'childList' && m.target !== document.head)) {
                requestIdleCallback(injectSchema);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start initialization
    initialize();
})();
