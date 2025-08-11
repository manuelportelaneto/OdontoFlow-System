import { UserRepository } from '@n8n/db';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { ExternalHooks } from '../external-hooks';
import { MfaService } from '../mfa/mfa.service';
import { AuthenticatedRequest, MFA } from '../requests';
export declare class MFAController {
    private mfaService;
    private externalHooks;
    private authService;
    private userRepository;
    constructor(mfaService: MfaService, externalHooks: ExternalHooks, authService: AuthService, userRepository: UserRepository);
    canEnableMFA(req: AuthenticatedRequest): Promise<void>;
    getQRCode(req: AuthenticatedRequest): Promise<{
        secret: string;
        recoveryCodes: string[];
        qrCode: string;
    }>;
    activateMFA(req: MFA.Activate, res: Response): Promise<void>;
    disableMFA(req: MFA.Disable, res: Response): Promise<void>;
    verifyMFA(req: MFA.Verify): Promise<void>;
}
