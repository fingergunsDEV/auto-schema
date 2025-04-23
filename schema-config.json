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

    // Utility to sanitize strings for JSON
    function sanitizeString(value) {
        if (typeof value !== 'string') return value;
        return value
            .replace(/"/g, '\\"') // Escape double quotes
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .replace(/\t/g, ' ') // Replace tabs with spaces
            .trim();
    }

    // Utility to replace placeholders in schema
    function replacePlaceholders(schema, data) {
        const schemaCopy = JSON.parse(JSON.stringify(schema)); // Deep copy
        function replaceInObject(obj) {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    let value = obj[key];
                    for (const [dataKey, dataValue] of Object.entries(data)) {
                        if (value.includes(`{${dataKey}}`)) {
                            if (dataKey === 'socialLinks' || dataKey === 'openingHoursDayOfWeek') {
                                // Handle arrays directly
                                value = dataValue;
                            } else {
                                value = value.replace(new RegExp(`{${dataKey}}`, 'g'), sanitizeString(dataValue));
                            }
                        }
                    }
                    obj[key] = value;
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    replaceInObject(obj[key]);
                }
            }
        }
        replaceInObject(schemaCopy);
        return schemaCopy;
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
                test: () => window.location.pathname.includes('/guide') || window.location.pathname.includes('/resource') || document.body.innerText.toLowerCase().includes('pillar'),
                weight: 0.8,
                type: () => 'pillar'
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
    function extractHowTo
