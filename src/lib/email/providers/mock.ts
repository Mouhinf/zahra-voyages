/**
 * Fournisseur Mock / Simulateur d'envoi d'email.
 * Enregistre les messages en mémoire pour les tests unitaires et la CI sans appel réseau.
 */

import { EmailOptions, EmailProvider, EmailProviderResult } from '../types';

export interface MockSentEmail extends EmailOptions {
  timestamp: string;
  messageId: string;
}

export class MockEmailProvider implements EmailProvider {
  readonly name = 'mock' as const;

  private static sentMessages: MockSentEmail[] = [];
  private static shouldFailNext = false;
  private static failureMessage = 'Simulated mock delivery failure';

  static getSentMessages(): MockSentEmail[] {
    return [...this.sentMessages];
  }

  static clear(): void {
    this.sentMessages = [];
    this.shouldFailNext = false;
  }

  static setSimulatedFailure(fail: boolean, message?: string): void {
    this.shouldFailNext = fail;
    if (message) this.failureMessage = message;
  }

  async send(options: EmailOptions): Promise<EmailProviderResult> {
    if (MockEmailProvider.shouldFailNext) {
      return {
        success: false,
        provider: this.name,
        error: MockEmailProvider.failureMessage,
      };
    }

    const messageId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const record: MockSentEmail = {
      ...options,
      timestamp: new Date().toISOString(),
      messageId,
    };

    MockEmailProvider.sentMessages.push(record);

    return {
      success: true,
      provider: this.name,
      messageId,
    };
  }
}
