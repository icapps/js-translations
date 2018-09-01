import * as fetch from 'node-fetch';
import { logger } from '../lib/logger';

/**
 * Get the Authorization header needed for calls
 */
export function getAuthHeaders(apiToken: string): { Authorization: string } {
  return { Authorization: `Token token=${apiToken}` };
}

/**
 * Get all available languages
 */
export async function getLanguages(apiUrl: string, apiToken: string): Promise<Language[]> {
  try {
    const url = `${apiUrl}/languages.json`;
    logger.info(`get languages from ${url}`);

    const res = await fetch(url, { headers: getAuthHeaders(apiToken) });
    if (res.status !== 200) throw new Error(`Languages could not be retrieved from ${url}`);

    return await res.json();
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
}

/**
 * Get a translation via their shortname
 */
export async function getTranslation(apiUrl: string, apiToken: string, shortName: string): Promise<Translation> {
  try {
    const url = `${apiUrl}/translations/${shortName}.json`;
    logger.info(`fetch translation from ${url}`);

    const res = await fetch(url, { headers: getAuthHeaders(apiToken) });
    if (res.status !== 200) throw new Error(`Translation could not be retrieved from ${url}`);

    return {
      name: shortName,
      body: await res.json(),
    };
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
}

// Interfaces
export interface Language {
  id: number;
  short_name: string;
}

export interface Translation {
  name: string;
  body: {
    translations: {
      [key: string]: string;
    }[];
  };
}
