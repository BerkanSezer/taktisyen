import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';

export const handle = async ({ event, resolve }) => {
	return resolve(event)
};
