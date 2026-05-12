import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  readonly checkoutSteps: Locator;
  readonly step1: Locator;
  readonly step2: Locator;
  readonly addressList: Locator;
  readonly useNewAddressButton: Locator;
  readonly newAddressForm: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly countryInput: Locator;
  readonly isDefaultCheckbox: Locator;
  readonly continueToReviewButton: Locator;
  readonly backToAddressButton: Locator;
  readonly placeOrderButton: Locator;
  readonly checkoutError: Locator;
  readonly checkoutItems: Locator;
  readonly orderNotesInput: Locator;
  readonly checkoutSummary: Locator;
  readonly checkoutSubtotal: Locator;
  readonly checkoutDiscount: Locator;
  readonly checkoutShipping: Locator;
  readonly checkoutTax: Locator;
  readonly checkoutTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutSteps = page.locator('[data-testid="checkout-steps"]');
    this.step1 = page.locator('[data-testid="checkout-step-1"]');
    this.step2 = page.locator('[data-testid="checkout-step-2"]');
    this.addressList = page.locator('[data-testid="address-list"]');
    this.useNewAddressButton = page.locator('[data-testid="use-new-address-button"]');
    this.newAddressForm = page.locator('[data-testid="new-address-form"]');
    this.firstNameInput = page.locator('[data-testid="addr-first-name"]');
    this.lastNameInput = page.locator('[data-testid="addr-last-name"]');
    this.streetInput = page.locator('[data-testid="addr-street"]');
    this.cityInput = page.locator('[data-testid="addr-city"]');
    this.stateInput = page.locator('[data-testid="addr-state"]');
    this.zipInput = page.locator('[data-testid="addr-zip"]');
    this.countryInput = page.locator('[data-testid="addr-country"]');
    this.isDefaultCheckbox = page.locator('[data-testid="addr-is-default"]');
    this.continueToReviewButton = page.locator('[data-testid="continue-to-review-button"]');
    this.backToAddressButton = page.locator('[data-testid="back-to-address-button"]');
    this.placeOrderButton = page.locator('[data-testid="place-order-button"]');
    this.checkoutError = page.locator('[data-testid="checkout-error"]');
    this.checkoutItems = page.locator('[data-testid="checkout-items"]');
    this.orderNotesInput = page.locator('[data-testid="order-notes-input"]');
    this.checkoutSummary = page.locator('[data-testid="checkout-summary"]');
    this.checkoutSubtotal = page.locator('[data-testid="checkout-subtotal"]');
    this.checkoutDiscount = page.locator('[data-testid="checkout-discount"]');
    this.checkoutShipping = page.locator('[data-testid="checkout-shipping"]');
    this.checkoutTax = page.locator('[data-testid="checkout-tax"]');
    this.checkoutTotal = page.locator('[data-testid="checkout-total"]');
  }

  async selectAddress(addressId: string): Promise<void> {
    const radio = this.page.locator(`[data-testid="address-radio-${addressId}"]`);
    await radio.check();
  }

  async chooseNewAddress(): Promise<void> {
    await this.useNewAddressButton.click();
  }

  async fillNewAddress(data: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.streetInput.fill(data.street);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zipCode);
    if (data.country) {
      await this.countryInput.fill(data.country);
    }
  }

  async continueToReview(): Promise<void> {
    await this.continueToReviewButton.click();
  }

  async backToAddress(): Promise<void> {
    await this.backToAddressButton.click();
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async addOrderNotes(notes: string): Promise<void> {
    await this.orderNotesInput.fill(notes);
  }

  async toBeOnCheckoutPage(): Promise<void> {
    await expect(this.page.locator('[data-testid="checkout-page"]')).toBeVisible();
  }

  async toBeOnStep(step: 1 | 2): Promise<void> {
    if (step === 1) {
      await expect(this.page.locator('[data-testid="checkout-address-step"]')).toBeVisible();
    } else {
      await expect(this.page.locator('[data-testid="checkout-review-step"]')).toBeVisible();
    }
  }
}
