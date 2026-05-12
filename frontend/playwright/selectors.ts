/**
 * Centralized data-testid constants for Playwright tests.
 * Every interactive element in the app has a corresponding entry here.
 * Usage: page.getByTestId(S.LOGIN.EMAIL)
 */

// ── Auth ──────────────────────────────────────────────────────────────────────
export const LOGIN = {
  CONTAINER: 'login-form-container',
  FORM: 'login-form',
  EMAIL: 'login-email-input',
  PASSWORD: 'login-password-input',
  SUBMIT: 'login-submit-button',
  ERROR: 'login-error',
  FORGOT_PASSWORD_LINK: 'forgot-password-link',
  REGISTER_LINK: 'register-link',
} as const;

export const REGISTER = {
  FORM: 'register-form',
  FIRST_NAME: 'register-first-name',
  LAST_NAME: 'register-last-name',
  EMAIL: 'register-email',
  PASSWORD: 'register-password',
  CONFIRM_PASSWORD: 'register-confirm-password',
  SUBMIT: 'register-submit-button',
  ERROR: 'register-error',
  LOGIN_LINK: 'login-link',
} as const;

export const FORGOT_PASSWORD = {
  EMAIL: 'forgot-password-email',
  SUBMIT: 'forgot-password-submit',
  SUCCESS: 'forgot-password-success',
} as const;

// ── Navbar ────────────────────────────────────────────────────────────────────
export const NAVBAR = {
  ROOT: 'navbar',
  LOGO: 'navbar-logo',
  SHOP_LINK: 'navbar-shop-link',
  ADMIN_LINK: 'navbar-admin-link',
  CART_BUTTON: 'navbar-cart-button',
  CART_COUNT: 'navbar-cart-count',
  PROFILE_LINK: 'navbar-profile-link',
  LOGOUT_BUTTON: 'navbar-logout-button',
  LOGIN_LINK: 'navbar-login-link',
} as const;

// ── Cart Sidebar ──────────────────────────────────────────────────────────────
export const CART_SIDEBAR = {
  ROOT: 'cart-sidebar',
  CLOSE: 'cart-sidebar-close',
  EMPTY: 'cart-sidebar-empty',
  ITEMS: 'cart-sidebar-items',
  ITEM: 'cart-sidebar-item',
  ITEM_NAME: 'cart-sidebar-item-name',
  ITEM_PRICE: 'cart-sidebar-item-price',
  ITEM_QUANTITY: 'cart-sidebar-item-quantity',
  ITEM_REMOVE: 'cart-sidebar-item-remove',
  COUPON_APPLIED: 'coupon-applied',
  SUBTOTAL: 'cart-sidebar-subtotal',
  TOTAL: 'cart-sidebar-total',
  CHECKOUT_BUTTON: 'cart-sidebar-checkout',
} as const;

// ── Home Page ─────────────────────────────────────────────────────────────────
export const HOME = {
  PAGE: 'home-page',
  HERO: 'hero-section',
  HERO_SHOP_BUTTON: 'hero-shop-button',
  HERO_REGISTER_BUTTON: 'hero-register-button',
  CATEGORIES_SECTION: 'categories-section',
  CATEGORY_TILE: 'category-tile',
  FEATURED_SECTION: 'featured-products-section',
  FEATURED_GRID: 'featured-products-grid',
  VIEW_ALL_LINK: 'view-all-link',
} as const;

// ── Shop Page ─────────────────────────────────────────────────────────────────
export const SHOP = {
  PAGE: 'shop-page',
  SEARCH_INPUT: 'search-input',
  RESULTS_COUNT: 'results-count',
  PRODUCT_GRID: 'product-grid',
  EMPTY_RESULTS: 'empty-results',
  CLEAR_FILTERS_BUTTON: 'clear-filters-button',
  CLEAR_FILTERS_EMPTY: 'clear-filters-empty-button',
  FILTER_SIDEBAR: 'filter-sidebar',
  MIN_PRICE: 'min-price-input',
  MAX_PRICE: 'max-price-input',
  SORT_SELECT: 'sort-select',
  PAGINATION: 'pagination',
  PAGINATION_PREV: 'pagination-prev',
  PAGINATION_NEXT: 'pagination-next',
  PAGINATION_INFO: 'pagination-info',
} as const;

// ── Product Card ──────────────────────────────────────────────────────────────
export const PRODUCT_CARD = {
  ROOT: 'product-card',
  NAME: 'product-card-name',
  PRICE: 'product-card-price',
  IMAGE: 'product-card-image',
  ADD_TO_CART: 'product-card-add-to-cart',
  OUT_OF_STOCK: 'product-card-out-of-stock',
  SALE_BADGE: 'product-card-sale-badge',
  LOW_STOCK: 'product-card-low-stock',
} as const;

// ── Product Detail Page ───────────────────────────────────────────────────────
export const PRODUCT_DETAIL = {
  PAGE: 'product-detail-page',
  BREADCRUMB: 'breadcrumb',
  GALLERY: 'product-gallery',
  MAIN_IMAGE: 'product-main-image',
  THUMBNAILS: 'product-thumbnails',
  INFO: 'product-info',
  NAME: 'product-name',
  PRICE: 'product-price',
  COMPARE_PRICE: 'product-compare-price',
  DISCOUNT_PCT: 'product-discount-pct',
  RATING_SUMMARY: 'product-rating-summary',
  OUT_OF_STOCK_BADGE: 'out-of-stock-badge',
  LOW_STOCK_BADGE: 'low-stock-badge',
  IN_STOCK_BADGE: 'in-stock-badge',
  DESCRIPTION: 'product-description',
  SKU: 'product-sku',
  QUANTITY_SELECTOR: 'product-quantity-selector',
  ADD_TO_CART: 'add-to-cart-button',
  REVIEWS_SECTION: 'reviews-section',
  REVIEWS_COUNT: 'reviews-count',
  REVIEWS_LIST: 'reviews-list',
  REVIEW_ITEM: 'review-item',
  REVIEW_ITEM_TITLE: 'review-item-title',
  REVIEW_ITEM_BODY: 'review-item-body',
  REVIEW_ITEM_DATE: 'review-item-date',
  NO_REVIEWS: 'no-reviews',
  REVIEW_FORM: 'review-form',
  REVIEW_RATING_INPUT: 'review-rating-input',
  REVIEW_TITLE_INPUT: 'review-title-input',
  REVIEW_BODY_INPUT: 'review-body-input',
  REVIEW_SUBMIT: 'review-submit-button',
  REVIEW_ERROR: 'review-error',
  REVIEW_SUCCESS: 'review-success-message',
  REVIEW_LOGIN_PROMPT: 'review-login-prompt',
  REVIEW_ALREADY_SUBMITTED: 'review-already-submitted',
} as const;

// ── Quantity Selector ─────────────────────────────────────────────────────────
export const QUANTITY_SELECTOR = (testId = 'quantity-selector') => ({
  ROOT: testId,
  DECREASE: `${testId}-decrease`,
  VALUE: `${testId}-value`,
  INCREASE: `${testId}-increase`,
}) as const;

// ── Coupon Input ──────────────────────────────────────────────────────────────
export const COUPON = {
  CONTAINER: 'coupon-input-container',
  INPUT: 'coupon-code-input',
  APPLY_BUTTON: 'coupon-apply-button',
  ERROR: 'coupon-error',
  APPLIED: 'coupon-applied',
  APPLIED_CODE: 'coupon-applied-code',
  REMOVE: 'coupon-remove-button',
} as const;

// ── Cart Page ─────────────────────────────────────────────────────────────────
export const CART = {
  PAGE: 'cart-page',
  EMPTY: 'empty-cart',
  LOGIN_PROMPT: 'cart-login-prompt',
  ITEM_COUNT: 'cart-item-count',
  ITEMS: 'cart-items',
  ITEM: 'cart-item',
  ITEM_NAME: 'cart-item-name',
  ITEM_UNIT_PRICE: 'cart-item-unit-price',
  ITEM_TOTAL: 'cart-item-total',
  ITEM_REMOVE: 'cart-item-remove',
  SUMMARY: 'cart-summary',
  SUBTOTAL: 'cart-subtotal',
  DISCOUNT: 'cart-discount',
  SHIPPING: 'cart-shipping',
  TAX: 'cart-tax',
  TOTAL: 'cart-total',
  CHECKOUT_BUTTON: 'checkout-button',
  CONTINUE_SHOPPING: 'continue-shopping-link',
} as const;

// ── Checkout Page ─────────────────────────────────────────────────────────────
export const CHECKOUT = {
  PAGE: 'checkout-page',
  STEPS: 'checkout-steps',
  STEP_1: 'checkout-step-1',
  STEP_2: 'checkout-step-2',
  ADDRESS_STEP: 'checkout-address-step',
  ADDRESS_LIST: 'address-list',
  USE_NEW_ADDRESS: 'use-new-address-button',
  NEW_ADDRESS_FORM: 'new-address-form',
  ADDR_FIRST_NAME: 'addr-first-name',
  ADDR_LAST_NAME: 'addr-last-name',
  ADDR_STREET: 'addr-street',
  ADDR_CITY: 'addr-city',
  ADDR_STATE: 'addr-state',
  ADDR_ZIP: 'addr-zip',
  ADDR_COUNTRY: 'addr-country',
  ADDR_IS_DEFAULT: 'addr-is-default',
  CONTINUE_BUTTON: 'continue-to-review-button',
  REVIEW_STEP: 'checkout-review-step',
  REVIEW_ITEMS: 'checkout-items',
  ORDER_NOTES: 'order-notes-input',
  BACK_BUTTON: 'back-to-address-button',
  PLACE_ORDER: 'place-order-button',
  ERROR: 'checkout-error',
  SUMMARY: 'checkout-summary',
  SUBTOTAL: 'checkout-subtotal',
  DISCOUNT: 'checkout-discount',
  SHIPPING: 'checkout-shipping',
  TAX: 'checkout-tax',
  TOTAL: 'checkout-total',
} as const;

// ── Order Confirmation ────────────────────────────────────────────────────────
export const ORDER_CONFIRMATION = {
  PAGE: 'order-confirmation-page',
  HEADER: 'confirmation-header',
  ORDER_NUMBER: 'order-number',
  ORDER_DATE: 'order-date',
  ORDER_STATUS: 'order-status',
  ITEMS: 'confirmation-items',
  ITEM: 'confirmation-item',
  ADDRESS: 'confirmation-address',
  TOTALS: 'confirmation-totals',
  TOTAL: 'confirmation-total',
  VIEW_ORDERS: 'view-orders-button',
  CONTINUE_SHOPPING: 'continue-shopping-button',
} as const;

// ── Orders Page ───────────────────────────────────────────────────────────────
export const ORDERS = {
  PAGE: 'orders-page',
  EMPTY: 'orders-empty',
  LIST: 'orders-list',
  ITEM: 'order-item',
  ITEM_NUMBER: 'order-item-number',
  ITEM_DATE: 'order-item-date',
  ITEM_STATUS: 'order-item-status',
  ITEM_TOTAL: 'order-item-total',
  ITEM_VIEW: 'order-item-view-button',
  PAGINATION: 'orders-pagination',
  PAGINATION_PREV: 'orders-pagination-prev',
  PAGINATION_NEXT: 'orders-pagination-next',
  PAGINATION_INFO: 'orders-pagination-info',
} as const;

// ── Order Detail ──────────────────────────────────────────────────────────────
export const ORDER_DETAIL = {
  PAGE: 'order-detail-page',
  NUMBER: 'order-detail-number',
  DATE: 'order-detail-date',
  STATUS: 'order-detail-status',
  CANCEL_BUTTON: 'cancel-order-button',
  CANCEL_DIALOG: 'cancel-confirm-dialog',
  CANCEL_NO: 'cancel-confirm-no',
  CANCEL_YES: 'cancel-confirm-yes',
  ITEMS: 'order-detail-items',
  ITEM: 'order-detail-item',
  ADDRESS: 'order-detail-address',
  SUMMARY: 'order-detail-summary',
  TOTAL: 'order-detail-total',
} as const;

// ── Profile Page ──────────────────────────────────────────────────────────────
export const PROFILE = {
  PAGE: 'profile-page',
  TABS: 'profile-tabs',
  TAB_INFO: 'profile-tab-info',
  TAB_ADDRESSES: 'profile-tab-addresses',
  TAB_PASSWORD: 'profile-tab-password',
  // Info tab
  INFO_FORM: 'profile-info-form',
  FIRST_NAME: 'profile-first-name',
  LAST_NAME: 'profile-last-name',
  EMAIL_DISPLAY: 'profile-email-display',
  PHONE: 'profile-phone',
  INFO_SUBMIT: 'profile-info-submit',
  INFO_SUCCESS: 'profile-info-success',
  INFO_ERROR: 'profile-info-error',
  // Addresses tab
  ADDRESSES_TAB: 'profile-addresses-tab',
  ADDRESSES_LIST: 'addresses-list',
  ADDRESS_CARD: 'address-card',
  ADDRESS_EDIT: 'address-edit',
  ADDRESS_DELETE: 'address-delete',
  ADDRESS_SET_DEFAULT: 'address-set-default',
  ADD_ADDRESS_BUTTON: 'add-address-button',
  ADDRESS_FORM: 'address-form',
  ADDR_FIRST_NAME: 'addr-form-first-name',
  ADDR_LAST_NAME: 'addr-form-last-name',
  ADDR_STREET: 'addr-form-street',
  ADDR_CITY: 'addr-form-city',
  ADDR_STATE: 'addr-form-state',
  ADDR_ZIP: 'addr-form-zip',
  ADDR_COUNTRY: 'addr-form-country',
  ADDR_DEFAULT: 'addr-form-default',
  ADDR_SUBMIT: 'addr-form-submit',
  ADDR_CANCEL: 'addr-form-cancel',
  ADDR_ERROR: 'addr-form-error',
  // Password tab
  PASSWORD_FORM: 'profile-password-form',
  CURRENT_PASSWORD: 'current-password-input',
  NEW_PASSWORD: 'new-password-input',
  CONFIRM_PASSWORD: 'confirm-password-input',
  PASSWORD_SUBMIT: 'change-password-submit',
  PASSWORD_SUCCESS: 'password-success',
  PASSWORD_ERROR: 'password-error',
} as const;

// ── Not Found ─────────────────────────────────────────────────────────────────
export const NOT_FOUND = {
  PAGE: 'not-found-page',
  CODE: 'not-found-code',
  HOME_BUTTON: 'not-found-home-button',
} as const;

// ── Admin: Dashboard ──────────────────────────────────────────────────────────
export const ADMIN_DASHBOARD = {
  PAGE: 'admin-dashboard-page',
  STATS: 'dashboard-stats',
  STAT_ORDERS: 'stat-total-orders',
  STAT_PRODUCTS: 'stat-total-products',
  STAT_USERS: 'stat-total-users',
  RECENT_ORDERS: 'recent-orders',
  RECENT_ORDERS_TABLE: 'recent-orders-table',
  RECENT_ORDER_ROW: 'recent-order-row',
  RECENT_ORDER_NUMBER: 'recent-order-number',
  VIEW_ALL_LINK: 'view-all-orders-link',
} as const;

// ── Admin: Products ───────────────────────────────────────────────────────────
export const ADMIN_PRODUCTS = {
  PAGE: 'admin-products-page',
  CREATE_BUTTON: 'create-product-button',
  SEARCH: 'products-search-input',
  TABLE: 'products-table',
  ROW: 'product-row',
  ROW_NAME: 'product-row-name',
  ROW_SKU: 'product-row-sku',
  ROW_PRICE: 'product-row-price',
  ROW_STOCK: 'product-row-stock',
  ROW_TOGGLE_ACTIVE: 'product-row-toggle-active',
  ROW_EDIT: 'product-row-edit',
  ROW_DELETE: 'product-row-delete',
  ROW_DELETE_CONFIRM: 'product-row-delete-confirm',
  ROW_DELETE_CANCEL: 'product-row-delete-cancel',
  EMPTY: 'products-empty',
  PAGINATION: 'products-pagination',
  PREV: 'products-prev',
  NEXT: 'products-next',
} as const;

// ── Admin: Product Form ───────────────────────────────────────────────────────
export const ADMIN_PRODUCT_FORM = {
  PAGE: 'admin-product-form-page',
  TITLE: 'product-form-title',
  FORM: 'product-form',
  NAME: 'product-form-name',
  SLUG: 'product-form-slug',
  DESCRIPTION: 'product-form-description',
  PRICE: 'product-form-price',
  COMPARE_PRICE: 'product-form-compare-price',
  STOCK: 'product-form-stock',
  SKU: 'product-form-sku',
  CATEGORY: 'product-form-category',
  IMAGE_URLS: 'product-form-image-urls',
  IS_ACTIVE: 'product-form-is-active',
  IS_FEATURED: 'product-form-is-featured',
  SUBMIT: 'product-form-submit',
  CANCEL: 'product-form-cancel',
  ERROR: 'product-form-error',
} as const;

// ── Admin: Categories ─────────────────────────────────────────────────────────
export const ADMIN_CATEGORIES = {
  PAGE: 'admin-categories-page',
  CREATE_BUTTON: 'create-category-button',
  FORM: 'category-form',
  FORM_NAME: 'category-form-name',
  FORM_SLUG: 'category-form-slug',
  FORM_DESCRIPTION: 'category-form-description',
  FORM_IMAGE_URL: 'category-form-image-url',
  FORM_PARENT: 'category-form-parent',
  FORM_SUBMIT: 'category-form-submit',
  FORM_CANCEL: 'category-form-cancel',
  FORM_ERROR: 'category-form-error',
  TABLE: 'categories-table',
  ROW: 'category-row',
  ROW_NAME: 'category-row-name',
  ROW_SLUG: 'category-row-slug',
  ROW_PARENT: 'category-row-parent',
  ROW_EDIT: 'category-row-edit',
  ROW_DELETE: 'category-row-delete',
  ROW_DELETE_CONFIRM: 'category-row-delete-confirm',
  ROW_DELETE_CANCEL: 'category-row-delete-cancel',
  EMPTY: 'categories-empty',
} as const;

// ── Admin: Orders ─────────────────────────────────────────────────────────────
export const ADMIN_ORDERS = {
  PAGE: 'admin-orders-page',
  TOTAL: 'orders-total',
  STATUS_FILTER: 'status-filter',
  TABLE: 'admin-orders-table',
  ROW: 'admin-order-row',
  ROW_NUMBER: 'admin-order-number',
  ROW_DATE: 'admin-order-date',
  ROW_STATUS: 'admin-order-status',
  ROW_ITEMS: 'admin-order-items',
  ROW_TOTAL: 'admin-order-total',
  ROW_VIEW: 'admin-order-view',
  EMPTY: 'admin-orders-empty',
  PAGINATION: 'admin-orders-pagination',
  PREV: 'admin-orders-prev',
  NEXT: 'admin-orders-next',
} as const;

// ── Admin: Order Detail ───────────────────────────────────────────────────────
export const ADMIN_ORDER_DETAIL = {
  PAGE: 'admin-order-detail-page',
  NUMBER: 'admin-order-detail-number',
  DATE: 'admin-order-detail-date',
  STATUS: 'admin-order-detail-status',
  STATUS_UPDATE: 'admin-order-status-update',
  STATUS_SELECT: 'admin-order-status-select',
  STATUS_SAVE: 'admin-order-status-save',
  STATUS_SUCCESS: 'admin-order-status-success',
  ITEMS: 'admin-order-items',
  ITEM: 'admin-order-item',
  ADDRESS: 'admin-order-address',
  NOTES: 'admin-order-notes',
  SUMMARY: 'admin-order-summary',
  TOTAL: 'admin-order-total',
} as const;

// ── Admin: Users ──────────────────────────────────────────────────────────────
export const ADMIN_USERS = {
  PAGE: 'admin-users-page',
  TOTAL: 'users-total',
  TABLE: 'users-table',
  ROW: 'user-row',
  ROW_NAME: 'user-row-name',
  ROW_EMAIL: 'user-row-email',
  ROW_ROLE: 'user-row-role',
  ROW_STATUS: 'user-row-status',
  ROW_JOINED: 'user-row-joined',
  ROW_TOGGLE_ACTIVE: 'user-row-toggle-active',
  EMPTY: 'users-empty',
  PAGINATION: 'users-pagination',
  PREV: 'users-prev',
  NEXT: 'users-next',
} as const;

// ── Admin: Coupons ────────────────────────────────────────────────────────────
export const ADMIN_COUPONS = {
  PAGE: 'admin-coupons-page',
  CREATE_BUTTON: 'create-coupon-button',
  FORM: 'coupon-form',
  FORM_CODE: 'coupon-form-code',
  FORM_TYPE: 'coupon-form-type',
  FORM_VALUE: 'coupon-form-value',
  FORM_MIN_AMOUNT: 'coupon-form-min-amount',
  FORM_MAX_DISCOUNT: 'coupon-form-max-discount',
  FORM_USAGE_LIMIT: 'coupon-form-usage-limit',
  FORM_EXPIRES_AT: 'coupon-form-expires-at',
  FORM_IS_ACTIVE: 'coupon-form-is-active',
  FORM_SUBMIT: 'coupon-form-submit',
  FORM_CANCEL: 'coupon-form-cancel',
  FORM_ERROR: 'coupon-form-error',
  TABLE: 'coupons-table',
  ROW: 'coupon-row',
  ROW_CODE: 'coupon-row-code',
  ROW_DISCOUNT: 'coupon-row-discount',
  ROW_CONSTRAINTS: 'coupon-row-constraints',
  ROW_USAGE: 'coupon-row-usage',
  ROW_EXPIRES: 'coupon-row-expires',
  ROW_TOGGLE: 'coupon-row-toggle',
  ROW_DELETE: 'coupon-row-delete',
  ROW_DELETE_CONFIRM: 'coupon-row-delete-confirm',
  ROW_DELETE_CANCEL: 'coupon-row-delete-cancel',
  EMPTY: 'coupons-empty',
  PAGINATION: 'coupons-pagination',
  PREV: 'coupons-prev',
  NEXT: 'coupons-next',
} as const;

// ── Seed Test Credentials ─────────────────────────────────────────────────────
export const TEST_USERS = {
  ADMIN: { email: 'admin@qashop.com', password: 'Admin123!' },
  CUSTOMER_WITH_ORDERS: { email: 'customer1@test.com', password: 'Test123!' },
  CUSTOMER_PENDING_ORDER: { email: 'customer2@test.com', password: 'Test123!' },
  CUSTOMER_WITH_CART: { email: 'customer3@test.com', password: 'Test123!' },
  CUSTOMER_CLEAN: { email: 'customer4@test.com', password: 'Test123!' },
  CUSTOMER_WITH_ADDRESSES: { email: 'customer5@test.com', password: 'Test123!' },
} as const;

export const TEST_COUPONS = {
  PERCENTAGE: 'SAVE10',
  PERCENTAGE_MIN_ORDER: 'SAVE20',
  FIXED: 'FLAT15',
  BIG_DISCOUNT: 'BIGDEAL',
  EXPIRED: 'EXPIRED',
  MAXED_OUT: 'MAXUSED',
} as const;
