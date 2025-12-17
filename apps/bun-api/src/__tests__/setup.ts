import { Logger } from '@student-api/shared-logger';
import { Config, validateEnv } from '@student-api/shared-config';
import { JwtUtil } from '@student-api/shared-utils';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Logger and Config before all tests
Logger.initialize('node');
const env = validateEnv();
Config.initialize(env);

// Initialize JwtUtil with secrets
JwtUtil.initialize(env.JWT_SECRET, env.JWT_REFRESH_SECRET);
