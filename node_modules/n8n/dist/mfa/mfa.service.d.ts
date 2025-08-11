import { UserRepository } from '@n8n/db';
import { Cipher } from 'n8n-core';
import { TOTPService } from './totp.service';
export declare class MfaService {
    private userRepository;
    totp: TOTPService;
    private cipher;
    constructor(userRepository: UserRepository, totp: TOTPService, cipher: Cipher);
    generateRecoveryCodes(n?: number): string[];
    saveSecretAndRecoveryCodes(userId: string, secret: string, recoveryCodes: string[]): Promise<void>;
    encryptSecretAndRecoveryCodes(rawSecret: string, rawRecoveryCodes: string[]): {
        encryptedRecoveryCodes: string[];
        encryptedSecret: string;
    };
    private decryptSecretAndRecoveryCodes;
    getSecretAndRecoveryCodes(userId: string): Promise<{
        decryptedSecret: string;
        decryptedRecoveryCodes: string[];
    }>;
    validateMfa(userId: string, mfaCode: string | undefined, mfaRecoveryCode: string | undefined): Promise<boolean>;
    enableMfa(userId: string): Promise<import("@n8n/db").User>;
    disableMfaWithMfaCode(userId: string, mfaCode: string): Promise<void>;
    disableMfaWithRecoveryCode(userId: string, recoveryCode: string): Promise<void>;
    private disableMfaForUser;
}
