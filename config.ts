import { config as configDev } from './config/config.development';
import { config as configProd } from './config/config.production';

let config;

if (process.env.NODE_ENV === 'production') {
    config = configProd;
} else {
    config = configDev;
}

export default config;
