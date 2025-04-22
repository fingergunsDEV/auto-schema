(function() {
    // Default configuration
    const defaultConfig = {
        configUrl: 'https://fingergunsdev.github.io/auto-schema/schema-config.json',
        templateUrl: 'https://fingergunsdev.github.io/auto-schema/schema-templates.json',
        brand: 'Holistic Growth Marketing',
        logoUrl: 'https://cdn.prod.website-files.com/65db95957d65c02ae759f762/66fca6720ecaf4e682af0a99_blue%20logo%20new.avif',
        siteUrl: 'https://www.holisticgrowthmarketing.com/',
        socialLinks: [
            'https://www.facebook.com/holisticgrowthmarketing',
            'https://twitter.com/localseogrowth',
            'https://www.linkedin.com/company/holistic-growth-marketing',
            'https://www.instagram.com/holisticgrowthmarketingla',
            'https://www.yelp.com/biz/holistic-growth-marketing-los-angeles',
            'https://www.reddit.com/user/InstructionAny1236/',
            'https://medium.com/@holisticgrowthmarketing',
            'https://podcasters.spotify.com/pod/show/holisticgrowthmarketing',
            'https://www.iheart.com/podcast/269-holistic-marketing-minute-255521927/'
        ],
        address: {
            streetAddress: '215 Market St',
            addressLocality: 'Venice',
            addressRegion: 'CA',
            postalCode: '90291',
            addressCountry: 'US'
        },
        geo: {
            latitude: 33.9869,
            longitude: -118.4663
        },
        telephone: '+1-323-902-1031',
        openingHours: [
            {
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '17:00'
            }
        ],
        description: 'Unlock the full potential of your business by combining holistic SEO with cutting-edge business intelligence automation, data analysis, brand storytelling, and targeted content marketing.',
        areaServed: 'Global',
        services: [
            {
                name: 'On-page SEO',
                description: 'Optimize your website\'s content and structure for better search engine rankings.',
                id: 'https://www.holisticgrowthmarketing.com/services/on-page-seo#onPageSEO'
            },
            {
                name: 'Off-page SEO',
                description: 'Build your online authority through quality backlinks and external signals.',
                id: 'https://www.holisticgrowthmarketing.com/services/off-page-seo#offPageSEO'
            },
            {
                name: 'Technical SEO',
                description: 'Enhance the technical aspects of your website to improve its search engine performance.',
                id: 'https://www.holisticgrowthmarketing.com/services/technical-seo#technicalSEO'
            },
            {
                name: 'Keyword Research',
                description: 'Identify the most valuable keywords for targeting in your SEO strategy.',
                id: 'https://www.holisticgrowthmarketing.com/services/keyword-research#keywordResearch'
            },
            {
                name: 'Web Design',
                description: 'Create visually appealing and user-friendly website designs that engage visitors.',
                id: 'https://www.holisticgrowthmarketing.com/services/web-design#webDesign'
            },
            {
                name: 'Web Development',
                description: 'Build responsive and high-performance websites tailored to your business needs.',
                id: 'https://www.holisticgrowthmarketing.com/services/web-development#webDevelopment'
            },
            {
                name: 'SEO Reporting',
                description: 'Get detailed insights and analytics on your SEO performance.',
                id: 'https://www.holisticgrowthmarketing.com/services/seo-reporting#seoReporting'
            },
            {
                name: 'Trend Forecasting',
                description: 'Anticipate market trends and adapt your SEO strategy for future success.',
                id: 'https://www.holisticgrowthmarketing.com/services/trend-forecasting#trendForecasting'
            },
            {
                name: 'Local SEO',
                description: 'Optimize your online presence to attract local customers and improve local search rankings.',
                id: 'https://www.holisticgrowthmarketing.com/services/local-seo#localSEO'
            }
        ],
        faqSelectors: ['.faq-item h4', '.question'],
        howToSelectors: ['.howto-step h3', '.step-title'],
        breadcrumbSelectors: ['.breadcrumb-item a', '.w-breadcrumb a'],
        debug: true,
        remoteLogUrl: null
    };

    let config = defaultConfig;

    // Schema templates loaded externally
    let schemaMapping = {};

    // ProfessionalService schema
    const professionalServiceSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        'name': '{brand}',
        'description': '{description}',
        'image': '{logoUrl}',
        '@id': '{siteUrl}#professionalService',
        'url': '{siteUrl}',
        'telephone': '{telephone}',
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': '{streetAddress}',
            'addressLocality': '{addressLocality}',
            'addressRegion': '{addressRegion}',
            'postalCode': '{postalCode}',
            'addressCountry': '{addressCountry}'
        },
        'openingHoursSpecification': [
            {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': '{openingHoursDayOfWeek}',
                'opens': '{openingHoursOpens}',
                'closes': '{openingHoursCloses}'
            }
        ],
        'sameAs': [],
        'areaServed': '{areaServed}',
        'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'Marketing Services',
            'itemListElement': []
        },
        'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': '{telephone}',
            'contactType': 'Customer Service',
            'areaServed': '{areaServed}',
            'availableLanguage': 'English'
        }
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

    // Advanced page type detection
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
                test: () => document.querySelector('[class*="howto"], [id*="howto"]') || document.body.innerText.toLowerCase().includes('step'),
                weight: 0.8,
                type: () => 'howto'
            },
            {
                test: () => document.querySelector('article') || document.title.toLowerCase().includes('blog') || document.querySelector('meta[name="description"]')?.content.toLowerCase().includes('article'),
                weight: 0.7,
                type: () => 'article'
            },
            {
                test: () => window.location.pathname.includes('/services/'),
                weight: 0.9,
                type: () => 'service'
            },
            {
                test: () => window.location.pathname.includes('/location'),
                weight: 0.9,
                type: () => 'location'
            },
            {
                test: () => window.location.pathname.includes('/about'),
                weight: 0.9,
                type: () => 'about'
            },
            {
                test: () => window.location.pathname === '/' || window.location.pathname === '/index.html',
                weight: 0.9,
                type: () => 'homepage'
            },
            {
                test: () => document.querySelector('.breadcrumb, .w-breadcrumb'),
                weight: 0.6,
                type: () => 'breadcrumb'
            },
            {
                test: () => true,
                weight: 0.1,
                type: () => 'homepage'
            }
        ];

        let highestScore = 0;
        let detectedType = 'homepage';

        signals.forEach(signal => {
            const result = signal.test();
            if (result && schemaMapping[signal.type(result)]) {
                const score = signal.weight;
                if (score > highestScore) {
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

        // Check for existing FAQ schema
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

    // Extract HowTo steps
    function extractHowToSteps() {
        const steps = [];
        const selectors = config.howToSelectors || [];
        const elements = document.querySelectorAll(selectors.join(', '));

        elements.forEach((step, index) => {
            const description = step.nextElementSibling?.textContent.trim() || '';
            if (description) {
                steps.push({
                    '@type': 'HowToStep',
                    'name': step.textContent.trim(),
                    'text': description,
                    'position': index + 1
                });
            }
        });

        return steps;
    }

    // Extract Breadcrumbs
    function extractBreadcrumbs() {
        const breadcrumbs = [];
        const selectors = config.breadcrumbSelectors || [];
        const elements = document.querySelectorAll(selectors.join(', '));

        elements.forEach((item, index) => {
            const name = item.textContent.trim();
            const url = item.href || '';
            if (name && url) {
                breadcrumbs.push({
                    '@type': 'ListItem',
                    'position': index + 1,
                    'name': name,
                    'item': url
                });
            }
        });

        return breadcrumbs;
    }

    // Main function to generate and inject schema
    async function injectSchema() {
        try {
            // Gather page data
            const pageData = {
                title: document.title || 'Holistic Growth Marketing',
                metaDescription: document.querySelector('meta[name="description"]')?.content || config.description,
                datePublished: document.querySelector('meta[name="article:published_time"]')?.content || new Date().toISOString(),
                dateModified: document.querySelector('meta[name="article:modified_time"]')?.content || new Date().toISOString(),
                brand: config.brand,
                siteUrl: config.siteUrl,
                pageUrl: window.location.href,
                logoUrl: config.logoUrl,
                description: config.description,
                telephone: config.telephone,
                streetAddress: config.address.streetAddress,
                addressLocality: config.address.addressLocality,
                addressRegion: config.address.addressRegion,
                postalCode: config.address.postalCode,
                addressCountry: config.address.addressCountry,
                latitude: config.geo.latitude,
                longitude: config.geo.longitude,
                openingHoursDayOfWeek: JSON.stringify(config.openingHours[0].dayOfWeek),
                openingHoursOpens: config.openingHours[0].opens,
                openingHoursCloses: config.openingHours[0].closes,
                areaServed: config.areaServed,
                socialLinks: JSON.stringify(config.socialLinks),
                serviceType: document.querySelector('meta[name="service-type"]')?.content || '',
                serviceId: document.querySelector('meta[name="service-id"]')?.content || window.location.hash || 'service'
            };

            // Detect page type
            const pageType = detectPageType();
            let schema = schemaMapping[pageType]?.template;

            if (!schema) {
                logToRemote(`No schema template for page type: ${pageType}`, 'warn');
                return;
            }

            // Handle specific page types
            if (pageType === 'faq') {
                schema.mainEntity = extractFAQ();
            } else if (pageType === 'howto') {
                schema.step = extractHowToSteps();
            } else if (pageType === 'breadcrumb') {
                schema.itemListElement = extractBreadcrumbs();
            }

            // Prepare ProfessionalService schema
            const serviceSchema = replacePlaceholders(professionalServiceSchema, pageData);
            serviceSchema.sameAs = config.socialLinks;
            serviceSchema.hasOfferCatalog.itemListElement = config.services.map(service => ({
                '@type': 'Offer',
                'itemOffered': {
                    '@type': 'Service',
                    'name': service.name,
                    'description': service.description,
                    '@id': service.id
                }
            }));

            // Replace placeholders in main schema
            schema = replacePlaceholders(schema, pageData);

            // Combine schemas
            const finalSchema = [schema, serviceSchema].filter(s => validateSchema(s));
            if (pageType !== 'homepage' && pageType !== 'searchbox') {
                finalSchema.shift(); // Include WebSite schema only for homepage or searchbox
            }

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
        schemaMapping = await fetchResource(config.templateUrl, {});

        // Run initial injection
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => requestIdleCallback(injectSchema));
        } else {
            requestIdleCallback(injectSchema);
        }

        // Observe DOM changes for Webflow CMS
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
