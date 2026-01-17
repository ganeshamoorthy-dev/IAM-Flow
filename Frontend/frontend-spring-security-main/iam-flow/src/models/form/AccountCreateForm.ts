import type { OtpStepForm } from "./OtpStepForm";
import type { PasswordStepForm } from "./PasswordStepForm";
import type { PersonalFormStep } from "./PersonalFormStep";


export const AccountType = {
  ORGANIZATION: 'ORGANIZATION',
  INDIVIDUAL: 'INDIVIDUAL',
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

export interface AccountCreateForm extends PersonalFormStep, OtpStepForm, PasswordStepForm {
  // Step 1 - Account Info
  accountName: string;
  accountDescription?: string;
  accountType: AccountType;
}
