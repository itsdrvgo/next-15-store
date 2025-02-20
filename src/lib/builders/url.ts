type PathParams = Record<string, string | number>;
type QueryParamValue =
    | string
    | number
    | boolean
    | Array<string | number | boolean>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Record<string, any>;

/**
 * A flexible URL builder for constructing complex URLs with path templates, query parameters, and hash fragments.
 */
class URLBuilder {
    private baseUrl: string;
    private pathTemplate: string;
    private pathParams: PathParams;
    private queryParams: Map<string, QueryParamValue>;
    private hashFragment: string;
    private trailingSlash: boolean;

    /**
     * Creates a new instance of URLBuilder.
     * @param baseUrl The base URL to start building from.
     * @example
     * const builder = new URLBuilder('https://api.example.com');
     */
    constructor(baseUrl: string = "/") {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        this.pathTemplate = "";
        this.pathParams = {};
        this.queryParams = new Map();
        this.hashFragment = "";
        this.trailingSlash = false;
    }

    /**
     * Sets the path template for the URL.
     * @param template The path template with placeholders (e.g., '/users/:userId/posts/:postId').
     * @returns The current URLBuilder instance for method chaining.
     * @example
     * builder.setPathTemplate('/users/:userId/posts/:postId');
     */
    setPathTemplate(template: string): URLBuilder {
        this.pathTemplate = template;
        return this;
    }

    /**
     * Sets a path parameter value.
     * @param key The name of the path parameter.
     * @param value The value to set for the path parameter.
     * @returns The current URLBuilder instance for method chaining.
     * @example
     * builder.setPathParam('userId', 123);
     */
    setPathParam(key: string, value: string | number): URLBuilder {
        this.pathParams[key] = value;
        return this;
    }

    /**
     * Adds a query parameter to the URL.
     * @param key The name of the query parameter.
     * @param value The value of the query parameter (can be a primitive, array, or object).
     * @returns The current URLBuilder instance for method chaining.
     * @example
     * builder.addQueryParam('sort', 'date')
     *        .addQueryParam('include', ['comments', 'likes'])
     *        .addQueryParam('filter', { status: 'published' });
     */
    addQueryParam(key: string, value: QueryParamValue): URLBuilder {
        this.queryParams.set(key, value);
        return this;
    }

    /**
     * Sets the hash fragment of the URL.
     * @param hash The hash fragment to set (with or without the leading '#').
     * @returns The current URLBuilder instance for method chaining.
     * @example
     * builder.setHash('section1');
     */
    setHash(hash: string): URLBuilder {
        this.hashFragment = hash.startsWith("#") ? hash : `#${hash}`;
        return this;
    }

    /**
     * Sets whether to include a trailing slash at the end of the path.
     * @param include Whether to include a trailing slash.
     * @returns The current URLBuilder instance for method chaining.
     * @example
     * builder.setTrailingSlash(true);
     */
    setTrailingSlash(include: boolean): URLBuilder {
        this.trailingSlash = include;
        return this;
    }

    /**
     * Creates a clone of the current URLBuilder instance.
     * @returns A new URLBuilder instance with the same configuration.
     * @example
     * const newBuilder = builder.clone();
     */
    clone(): URLBuilder {
        const newBuilder = new URLBuilder(this.baseUrl);
        newBuilder.pathTemplate = this.pathTemplate;
        newBuilder.pathParams = { ...this.pathParams };
        newBuilder.queryParams = new Map(this.queryParams);
        newBuilder.hashFragment = this.hashFragment;
        newBuilder.trailingSlash = this.trailingSlash;
        return newBuilder;
    }

    private serializeQueryParam(value: QueryParamValue): string {
        if (Array.isArray(value)) {
            return value.map((v) => encodeURIComponent(String(v))).join(",");
        } else if (typeof value === "object" && value !== null) {
            return encodeURIComponent(JSON.stringify(value));
        }
        return encodeURIComponent(String(value));
    }

    /**
     * Builds the final URL based on the current configuration.
     * @returns The constructed URL as a string.
     * @example
     * const url = builder
     *   .setPathTemplate('/users/:userId/posts')
     *   .setPathParam('userId', 123)
     *   .addQueryParam('sort', 'date')
     *   .setHash('top')
     *   .build();
     * console.log(url); // https://api.example.com/users/123/posts?sort=date#top
     */
    build(): string {
        let url = this.baseUrl;

        // Process path template
        if (this.pathTemplate) {
            const path = this.pathTemplate.replace(/:(\w+)/g, (_, key) => {
                if (key in this.pathParams) {
                    return encodeURIComponent(String(this.pathParams[key]));
                }
                throw new Error(`Missing path parameter: ${key}`);
            });
            url += path;
        }

        // Add trailing slash if needed
        if (this.trailingSlash && !url.endsWith("/")) {
            url += "/";
        }

        // Process query parameters
        if (this.queryParams.size > 0) {
            const queryString = Array.from(this.queryParams.entries())
                .map(
                    ([key, value]) =>
                        `${encodeURIComponent(key)}=${this.serializeQueryParam(
                            value
                        )}`
                )
                .join("&");
            url += `?${queryString}`;
        }

        // Add hash fragment
        if (this.hashFragment) {
            url += this.hashFragment;
        }

        return url;
    }
}

export { URLBuilder };
