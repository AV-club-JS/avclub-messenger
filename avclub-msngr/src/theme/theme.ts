import { extendTheme } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';

const customTheme = extendTheme({
    ...theme,
    colors: {
        ...theme.colors,
        brand: {
            primary: '#001f3f',
            accent: '#77D4FC',
        },
    },
});

export default customTheme;
