import { config as configDev } from './config/config.development';
import { config as configProd } from './config/config.production';

export default process.env.NODE_ENV === 'production' ? configProd : configDev;
